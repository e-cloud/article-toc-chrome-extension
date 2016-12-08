import Vue from 'vue'
import App from './App'
import '../sample/frameworks-cb4ede7df6d8670c4051172e4d6bc6916b3c765fa15b4ee9b348f157fdb85114.css'
import '../sample/github-f32b0e7dbc73ab49677d48d959274568a459569efc1cf486e83fe9aed5890998.css'
import TreeNode from './model/TreeNode'
import TreeRoot from './model/TreeRoot'

const headerSelector = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].join(', ')

/* eslint-disable no-new */
const instance = new Vue({
  template: '<App/>',
  components: { App },
  created() {
    // console.log(this);
  },
});

window.addEventListener('load', () => {
  document.querySelectorAll('article')
    .forEach(($article) => {
      const $container = document.createElement('div')
      $container.id = 'app'
      $article.parentNode.prepend($container)
      buildAll($article)
      instance.$mount($container)
    })
})

function buildAll($article) {
  const $headers = Array.from($article.querySelectorAll(headerSelector))
  return extractTreeViaLoop($headers)
}

function extractTreeViaLoop(headerList) {
  let currentLoc = 0
  let lastLoc = 0
  const root = new TreeRoot('test').setData({
    loc: -1
  })
  let parentNode = root

  while (currentLoc < headerList.length) {
    const currentLevel = getHeaderLevel(headerList[currentLoc])
    let lastLevel
    if (lastLoc >= 0) {
      lastLevel = getHeaderLevel(headerList[lastLoc])
    }

    // when first init
    // or currentLevel is same as lastLevel
    // or currentLevel is lower than lastLevel but higher than parentLevel,
    // directly append to current parent
    if (currentLoc === 0
      || currentLevel === lastLevel
      || (
        currentLevel < lastLevel
        && getHeaderLevel(headerList[parentNode.data.loc]) < currentLevel
      )
    ) {
      const node = new TreeNode(parentNode.root.generateNodeId())
      node.setParent(parentNode)
        .setRoot(parentNode.root)
        .setData({
          header: headerList[currentLoc],
          loc: currentLoc
        })
      parentNode.addChild(node)
      lastLoc = currentLoc
      currentLoc += 1
    }

    // when current is higher than last, create a sub-container in last, then append the current
    else if (currentLevel > lastLevel) {
      const child = parentNode.getLastChild().setAsParent()

      parentNode = child
      lastLoc = currentLoc
    }

    // currentLevel is lower than lastLevel but also lower than or equal to parent level,
    // rollback the lastLevel loc track point
    else if (currentLevel < lastLevel) {
      // reach to top container,
      // this happen when an article starts with high level header but lower level occurs later
      if (parentNode.getParent() === parentNode.root) {
        // push a track point into track stack, to create a new track
        // parentLocStack.push(currentLoc)
        parentNode = parentNode.getParent()
        lastLoc = currentLoc
      }
      // still inside the toc child scope, find its grandparent container
      else {
        lastLoc = parentNode.data.loc
        parentNode = parentNode.getParent()
      }
    }
  }

  return root
}


/**
 *
 * @param parentNode {TreeNode} the ToC direct container
 * @param currentLoc {number} the current location of the header list in traversal
 * @param lastLoc
 * @param headerList {Element[]}
 */
function extractTreeRecursively(parentNode, currentLoc, lastLoc, headerList) { // eslint-disable-line
  if (currentLoc >= headerList.length) return

  const currentLevel = getHeaderLevel(headerList[currentLoc])
  let lastLevel
  if (lastLoc >= 0) {
    lastLevel = getHeaderLevel(headerList[lastLoc])
  }

  // when first init
  // or currentLevel is same as lastLevel
  // or currentLevel is lower than lastLevel but higher than parentLevel,
  // directly append to current parent
  if (currentLoc === 0
    || currentLevel === lastLevel
    || (
      currentLevel < lastLevel
      && getHeaderLevel(headerList[parentNode.data.loc]) < currentLevel
    )
  ) {
    const node = new TreeNode(parentNode.root.generateNodeId())
    node.setParent(parentNode)
      .setRoot(parentNode.root)
      .setData({
        header: headerList[currentLoc],
        loc: currentLoc
      })
    parentNode.addChild(node)
    extractTreeRecursively(parentNode, currentLoc + 1, currentLoc, headerList)
  }

  // when current is higher than last, create a sub-container in last, then append the current
  else if (currentLevel > lastLevel) {
    const parent = parentNode.getLastChild().setAsParent()

    // push a track point into track stack
    // parentLocStack.push(currentLoc - 1)

    extractTreeRecursively(parent, currentLoc, currentLoc, headerList)
  }

  // currentLevel is lower than lastLevel but also lower than or equal to parent level,
  // rollback the lastLevel loc track point
  else if (currentLevel < lastLevel) {
    const newLastLoc = parentNode.data.loc

    // reach to top container,
    // this happen when an article starts with high level header but lower level occurs later
    if (parentNode.getParent() === parentNode.root) {
      // push a track point into track stack, to create a new track
      // parentLocStack.push(currentLoc)
      extractTreeRecursively(parentNode.getParent(), currentLoc, currentLoc, headerList)
    }
    // still inside the toc child scope, find its grandparent container
    else {
      extractTreeRecursively(parentNode.getParent(), currentLoc, newLastLoc, headerList)
    }
  }
}

function getHeaderLevel($h) {
  if ($h.tagName.toLowerCase()[0] !== 'h') {
    return -1
  }
  return parseInt($h.tagName.slice(1), 10)
}

/* function last(list) {
 return list[list.length - 1]
 } */
