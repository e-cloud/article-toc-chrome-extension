/*
 * copy and deviate from https://github.com/mozilla/readability
 */

/* eslint-disable */
const flags = 0x1 | 0x2 | 0x4
const FLAG_STRIP_UNLIKELYS = 0x1
const FLAG_WEIGHT_CLASSES = 0x2

const REGEXPS = {
  unlikelyCandidates: /banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|foot|header|legends|menu|modal|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i,
  okMaybeItsACandidate: /and|article|body|column|main|shadow/i,
  positive: /article|body|content|entry|hentry|h-entry|main|page|pagination|post|text|blog|story/i,
  negative: /hidden|^hid$| hid$| hid |^hid |banner|combx|comment|com-|contact|foot|footer|footnote|masthead|media|meta|modal|outbrain|promo|related|scroll|share|shoutbox|sidebar|skyscraper|sponsor|shopping|tags|tool|widget/i,
  extraneous: /print|archive|comment|discuss|e[\-]?mail|share|reply|all|login|sign|single|utility/i,
  byline: /byline|author|dateline|writtenby|p-author/i,
  replaceFonts: /<(\/?)font[^>]*>/gi,
  normalize: /\s{2,}/g,
  videos: /\/\/(www\.)?(dailymotion|youtube|youtube-nocookie|player\.vimeo)\.com/i,
  nextLink: /(next|weiter|continue|>([^|]|$)|»([^|]|$))/i,
  prevLink: /(prev|earl|old|new|<|«)/i,
  whitespace: /^\s*$/,
  hasContent: /\S$/,
}

const DEFAULT_N_TOP_CANDIDATES = 5

const HEADS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']

const DEFAULT_TAGS_TO_SCORE = 'section,h1,h2,h3,h4,h5,h6,p,td,pre'.toUpperCase().split(',')

const DIV_TO_P_ELEMS = ['A', 'BLOCKQUOTE', 'DL', 'DIV', 'IMG', 'OL', 'P', 'PRE', 'TABLE', 'UL', 'SELECT']

const BLOCKS_MAY_HAVE_NO_CONTENT = ['DIV', 'SECTION', 'HEADER', ...HEADS]

const dbg = (typeof console !== 'undefined') ? function (s) {
  console.log('Readability: ' + s)
} : function () {
}

export function grabArticle(page = document.body) {
  const stripUnlikelyCandidates = flagIsActive(FLAG_STRIP_UNLIKELYS)

  const originElements = page.getElementsByTagName('*')

  tagAllElement(originElements)

  const allElements = page.cloneNode(true).getElementsByTagName('*')
  /**
   * First, node prepping. Trash nodes that look cruddy (like ones with the class name "comment", etc), and turn divs
   * into P tags where they have been used inappropriately (as in, where they contain no other block level elements.)
   *
   * Note: Assignment from index for performance. See http://www.peachpit.com/articles/article.aspx?p=31567&seqNum=5
   * TODO: Shouldn't this be a reverse traversal?
   **/
  let node
  const nodesToScore = []
  for (let nodeIndex = 0; node = allElements[nodeIndex]; nodeIndex++) {
    const matchString = node.className + ' ' + node.id

    // Check to see if this node is a byline, and remove it if it is.
    if (checkByline(node, matchString)) {
      node.parentNode.removeChild(node)
      nodeIndex -= 1
      continue
    }

    /* Remove unlikely candidates */
    if (stripUnlikelyCandidates) {
      if (REGEXPS.unlikelyCandidates.test(matchString)
          && !REGEXPS.okMaybeItsACandidate.test(matchString)
          && node.tagName !== 'BODY'
          && node.tagName !== 'A'
      ) {
        dbg(`Removing unlikely candidate - ${matchString}`)
        node.parentNode.removeChild(node)
        nodeIndex -= 1
        continue
      }
    }

    if (BLOCKS_MAY_HAVE_NO_CONTENT.includes(node.tagName) && isElementWithoutContent(node)) {
      node.parentNode.removeChild(node)
      nodeIndex -= 1
      continue
    }

    if (DEFAULT_TAGS_TO_SCORE.includes(node.tagName)) {
      nodesToScore.push(node)
    }

    /* Turn all divs that don't have children block level elements into p's */
    if (node.tagName === 'DIV') {
      // Sites like http://mobile.slate.com encloses each paragraph with a DIV
      // element. DIVs with only a P element inside and no text content can be
      // safely converted into plain P elements to avoid confusing the scoring
      // algorithm with DIVs with are, in practice, paragraphs.
      if (hasSinglePInsideElement(node)) {
        let newNode = node.children[0]
        node.parentNode.replaceChild(newNode, node)
        node = newNode
      } else if (!hasChildBlockElement(node)) {
        node = setNodeTag(node, 'P')
        nodesToScore.push(node)
      } else {
        /* EXPERIMENTAL */
        for (const childNode of node.childNodes) {
          if (childNode.nodeType === Node.TEXT_NODE && childNode.textContent.trim().length > 0) {
            // Node.TEXT_NODE
            const p = document.createElement('p')
            p.innerHTML = childNode.nodeValue
            p.style.display = 'inline'
            p.className = 'readability-styled'
            childNode.parentNode.replaceChild(p, childNode)
          }
        }
      }
    }
  }

  /**
   * Loop through all paragraphs, and assign a score to them based on how content-y they look.
   * Then add their score to their parent node.
   *
   * A score is determined by things like number of commas, class names, etc. Maybe eventually link density.
   **/
  const candidates = []
  for (const nodeToScore of nodesToScore) {
    const parentNode = nodeToScore.parentNode

    if (!parentNode || typeof parentNode.tagName === 'undefined') {
      continue
    }

    const innerText = getInnerText(nodeToScore)
    /* If this paragraph is less than 25 characters, don't even count it. */
    if (innerText.length < 25 && !["H1", "H2"].includes(nodeToScore.tagName)) {
      continue
    }

    // Exclude nodes with no ancestor.
    const ancestors = getNodeAncestors(nodeToScore, 3)
    if (ancestors.length === 0) continue

    let contentScore = 0

    /* Add a point for the paragraph itself as a base. */
    contentScore += 1

    /* Add points for any commas within this paragraph */
    contentScore += innerText.split(',').length

    /* For every 100 characters in this paragraph, add another point. Up to 3 points. */
    contentScore += Math.min(Math.floor(innerText.length / 100), 3)

    ancestors.forEach(function (ancestor, level) {
      if (!ancestor.tagName) {
        return
      }

      if (typeof(ancestor.readability) === 'undefined') {
        initializeNode(ancestor)
        candidates.push(ancestor)
      }

      // Node score divider:
      // - parent:             1 (no division)
      // - grandparent:        2
      // - great grandparent+: ancestor level * 3
      let scoreDivider
      if (level === 0) {
        scoreDivider = 1
      } else if (level === 1) {
        scoreDivider = 2
      } else {
        scoreDivider = level * 3
      }
      ancestor.readability.contentScore += contentScore / scoreDivider
    })
  }

  /**
   * After we've calculated scores, loop through all of the possible candidate nodes we found
   * and find the one with the highest score.
   **/
  const topCandidates = []
  for (const candidate of candidates) {
    /**
     * Scale the final candidates score based on link density. Good content should have a
     * relatively small link density (5% or less) and be mostly unaffected by this operation.
     **/
    const candidateScore =
      candidate.readability.contentScore =
        candidate.readability.contentScore * (1 - getLinkDensity(candidate))

    dbg(`Candidate: ${candidate} (${candidate.className}:${candidate.id}) with score ${candidateScore}`)

    for (let t = 0; t < DEFAULT_N_TOP_CANDIDATES; t++) {
      const aTopCandidate = topCandidates[t]

      if (!aTopCandidate || candidateScore > aTopCandidate.readability.contentScore) {
        topCandidates.splice(t, 0, candidate)
        if (topCandidates.length > DEFAULT_N_TOP_CANDIDATES) {
          topCandidates.pop()
        }
        break
      }
    }
  }

  let topCandidate = topCandidates[0] || null
  let parentOfTopCandidate

  /**
   * If we still have no top candidate, just use the body as a last resort.
   * We also have to copy the body node so it is something we can modify.
   **/
  if (topCandidate === null || topCandidate.tagName === 'BODY') {
    topCandidate = document.body
  } else if (topCandidate) {
    // Find a better top candidate node if it contains (at least three) nodes which belong to `topCandidates` array
    // and whose scores are quite closed with current `topCandidate` node.
    const alternativeCandidateAncestors = []
    for (const candidate of topCandidates) {
      if (candidate.readability.contentScore / topCandidate.readability.contentScore >= 0.75) {
        alternativeCandidateAncestors.push(getNodeAncestors(candidate))
      }
    }
    const MINIMUM_TOP_CANDIDATES = 3
    if (alternativeCandidateAncestors.length >= MINIMUM_TOP_CANDIDATES) {
      parentOfTopCandidate = topCandidate.parentNode
      while (parentOfTopCandidate.tagName !== 'BODY') {
        let listsContainingThisAncestor = 0
        for (let ancestorIndex = 0;
             ancestorIndex < alternativeCandidateAncestors.length
             && listsContainingThisAncestor < MINIMUM_TOP_CANDIDATES;
             ancestorIndex++) {
          listsContainingThisAncestor += Number(alternativeCandidateAncestors[ancestorIndex].includes(parentOfTopCandidate))
        }
        if (listsContainingThisAncestor >= MINIMUM_TOP_CANDIDATES) {
          topCandidate = parentOfTopCandidate
          break
        }
        parentOfTopCandidate = parentOfTopCandidate.parentNode
      }
    }

    if (!topCandidate.readability) {
      initializeNode(topCandidate);
    }

    // Because of our bonus system, parents of candidates might have scores
    // themselves. They get half of the node. There won't be nodes with higher
    // scores than our topCandidate, but if we see the score going *up* in the first
    // few steps up the tree, that's a decent sign that there might be more content
    // lurking in other places that we want to unify in. The sibling stuff
    // below does some of that - but only if we've looked high enough up the DOM
    // tree.
    parentOfTopCandidate = topCandidate.parentNode
    let lastScore = topCandidate.readability.contentScore
    // The scores shouldn't get too low.
    const scoreThreshold = lastScore / 3
    while (parentOfTopCandidate.tagName !== 'BODY') {
      if (!parentOfTopCandidate.readability) {
        parentOfTopCandidate = parentOfTopCandidate.parentNode
        continue
      }
      const parentScore = parentOfTopCandidate.readability.contentScore
      if (parentScore < scoreThreshold) {
        break
      }
      if (parentScore > lastScore) {
        // Alright! We found a better parent to use.
        topCandidate = parentOfTopCandidate
        break
      }
      lastScore = parentOfTopCandidate.readability.contentScore
      parentOfTopCandidate = parentOfTopCandidate.parentNode
    }

    // If the top candidate is the only child, use parent instead. This will help sibling
    // joining logic when adjacent content is actually located in parent's sibling node.
    parentOfTopCandidate = topCandidate.parentNode

    while (parentOfTopCandidate.tagName !== 'BODY' && parentOfTopCandidate.children.length === 1) {
      topCandidate = parentOfTopCandidate
      parentOfTopCandidate = topCandidate.parentNode
    }
  }

  if (!topCandidate.readability) {
    initializeNode(topCandidate);
  }

  // Now that we have the top candidate, look through its siblings for content
  // that might also be related. Things like preambles, content split by ads
  // that we removed, etc.

  const siblingScoreThreshold = Math.max(10, topCandidate.readability.contentScore * 0.2)
  // Keep potential top candidate's parent node to try to get text direction of it later.
  parentOfTopCandidate = topCandidate.parentNode
  const siblings = parentOfTopCandidate.children

  let chooseParent = false
  for (const sibling of siblings) {
    dbg('Looking at sibling node:', sibling, sibling.readability ? `with score ${sibling.readability.contentScore}` : '')
    dbg('Sibling has score', sibling.readability ? sibling.readability.contentScore : 'Unknown')

    if (sibling !== topCandidate) {
      let contentBonus = 0

      // Give a bonus if sibling nodes and top candidates have the example same classname
      if (sibling.className === topCandidate.className && topCandidate.className !== '') {
        contentBonus += topCandidate.readability.contentScore * 0.2
      }

      if (sibling.readability && ((sibling.readability.contentScore + contentBonus) >= siblingScoreThreshold)) {
        chooseParent = true
      } else if (sibling.nodeName === 'P') {
        const linkDensity = getLinkDensity(sibling)
        const nodeContent = getInnerText(sibling)
        const nodeLength = nodeContent.length

        if (nodeLength > 80 && linkDensity < 0.25) {
          chooseParent = true
        } else if (
          nodeLength < 80
          && nodeLength > 0
          && linkDensity === 0
          && nodeContent.search(/\.( |$)/) !== -1
        ) {
          chooseParent = true
        }
      }

      if (chooseParent) break
    }
  }

  return findTargetElementByTocId(originElements, chooseParent ? parentOfTopCandidate : topCandidate)
}

let idCount = 0

function tagAllElement(elements) {
  Array.from(elements).forEach(function (elem) {
    elem.dataset.TOC_ID = idCount++
  })
}

function findTargetElementByTocId(elements, target) {
  return Array.from(elements).find(elem => elem.dataset.TOC_ID === target.dataset.TOC_ID)
}

function someNode(nodeList, fn) {
  return Array.prototype.some.call(nodeList, fn, this)
}

function getNodeAncestors(node, maxDepth = 0) {
  let i = 0
  const ancestors = []
  while (node.parentNode) {
    ancestors.push(node.parentNode)
    if (maxDepth && ++i === maxDepth) {
      break
    }
    node = node.parentNode
  }
  return ancestors
}

function setNodeTag(node, tag) {
  dbg('_setNodeTag', node, tag)

  const replacement = node.ownerDocument.createElement(tag)
  while (node.firstChild) {
    replacement.appendChild(node.firstChild)
  }
  node.parentNode.replaceChild(replacement, node)

  if (node.readability) {
    replacement.readability = node.readability
  }

  for (const attr of node.attributes) {
    replacement.setAttribute(attr.name, attr.value)
  }
  return replacement
}

function hasSinglePInsideElement(element) {
  // There should be exactly 1 element child which is a P:
  if (element.children.length !== 1 || element.children[0].tagName !== 'P') {
    return false
  }

  // And there should be no text nodes with real content
  return !someNode(element.childNodes, function (node) {
    return node.nodeType === Node.TEXT_NODE && REGEXPS.hasContent.test(node.textContent)
  })
}

function hasChildBlockElement(element) {
  return someNode(element.childNodes, function (node) {
    return DIV_TO_P_ELEMS.indexOf(node.tagName) !== -1 || hasChildBlockElement(node)
  })
}

function isValidByline(byline) {
  if (typeof byline === 'string') {
    byline = byline.trim()
    return (byline.length > 0) && (byline.length < 100)
  }
  return false
}

let articleByline = false
function checkByline(node, matchString) {
  if (articleByline) {
    return false
  }

  let rel
  if (node.getAttribute !== undefined) {
    rel = node.getAttribute('rel')
  }

  if ((rel === 'author' || REGEXPS.byline.test(matchString)) && isValidByline(node.textContent)) {
    articleByline = node.textContent.trim()
    return true
  }

  return false
}

function isElementWithoutContent(node) {
  return node.nodeType ===
         Node.ELEMENT_NODE
         &&
         node.textContent.trim().length ===
         0
         &&
         (node.children.length ===
          0 ||
          node.children.length ===
          node.getElementsByTagName('br').length +
          node.getElementsByTagName('hr').length)
}

function flagIsActive(flag) {
  return (flags & flag) > 0
}

function getInnerText(element, normalizeSpaces) {
  let textContent = ''

  if (typeof(element.textContent) === 'undefined' && typeof(element.innerText) === 'undefined') {
    return ''
  }

  normalizeSpaces = (typeof normalizeSpaces === 'undefined') ? true : normalizeSpaces

  if (navigator.appName === 'Microsoft Internet Explorer') {
    textContent = element.innerText.replace(REGEXPS.trim, '')
  }
  else {
    textContent = element.textContent.replace(REGEXPS.trim, '')
  }

  if (normalizeSpaces) {
    return textContent.replace(REGEXPS.normalize, ' ')
  }
  else {
    return textContent
  }
}

function getLinkDensity(e) {
  const links = e.getElementsByTagName('a')
  const textLength = getInnerText(e).length
  let linkLength = 0
  for (let i = 0, il = links.length; i < il; i += 1) {
    linkLength += getInnerText(links[i]).length
  }

  return linkLength / textLength
}

function initializeNode(node) {
  node.readability = { 'contentScore': 0 }

  switch (node.tagName) {
    case 'DIV':
      node.readability.contentScore += 5
      break

    case 'PRE':
    case 'TD':
    case 'BLOCKQUOTE':
      node.readability.contentScore += 3
      break

    case 'ADDRESS':
    case 'OL':
    case 'UL':
    case 'DL':
    case 'DD':
    case 'DT':
    case 'LI':
    case 'FORM':
      node.readability.contentScore -= 3
      break

    case 'H1':
    case 'H2':
    case 'H3':
    case 'H4':
    case 'H5':
    case 'H6':
    case 'TH':
      node.readability.contentScore -= 5
      break
  }

  node.readability.contentScore += getClassWeight(node)
}

function getClassWeight(e) {
  if (!flagIsActive(FLAG_WEIGHT_CLASSES)) {
    return 0
  }

  let weight = 0

  /* Look for a special classname */
  if (typeof(e.className) === 'string' && e.className !== '') {
    if (REGEXPS.negative.test(e.className)) {
      weight -= 25
    }

    if (REGEXPS.positive.test(e.className)) {
      weight += 25
    }
  }

  /* Look for a special ID */
  if (typeof(e.id) === 'string' && e.id !== '') {
    if (REGEXPS.negative.test(e.id)) {
      weight -= 25
    }

    if (REGEXPS.positive.test(e.id)) {
      weight += 25
    }
  }

  return weight
}
