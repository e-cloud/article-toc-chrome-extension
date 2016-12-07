const headerSelector = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].join(', ')
const anchorSelector = 'a[id]'
let headerUUID = 0

chrome.storage.sync.get({
    useInnerHTML: true
}, (options) => {
    window.addEventListener('load', function () {
        document.querySelectorAll('article')
            .forEach(($article) => {
                const $headers = Array.from($article.querySelectorAll(headerSelector))
                createHeaderIdIfNecessary($headers)
                const $container = buildAll($headers)
                $article.insertBefore($container, $article.firstChild)
            })
    })

    function buildAll($headers) {
        const $container = document.createElement('div')
        $container.classList.add('__article-toc-container')

        const $outline = document.createElement('ul')
        $outline.classList.add('__article-toc')
        $container.appendChild($outline)

        buildToC($outline, 0, -1, [-1], $headers)

        preventParentScroll($container)

        return $container
    }

    /**
     *
     * @param container the ToC direct container
     * @param currentloc the current location of the header list in traversal
     * @param lastloc the last location of header list, may change in traversal due to jumping from high to low
     * @param parentLocStack a stack that store the ancestors' loc
     * @param headerList
     */
    function buildToC(container, currentloc, lastloc, parentLocStack, headerList) {
        if (currentloc >= headerList.length) return

        const currentLevel = getHeaderLevel(headerList[currentloc])
        let lastLevel
        if (lastloc >= 0) {
            lastLevel = getHeaderLevel(headerList[lastloc])
        }

        // when first init
        // or current is same as last
        // or current is lower than last but higher than parent,
        // directly append to current parent
        if (currentloc === 0
            || currentLevel == lastLevel
            || (
                currentLevel < lastLevel
                && getHeaderLevel(headerList[last(parentLocStack)]) < currentLevel
            )
        ) {
            container.appendChild(createItem(headerList[currentloc], options))
            buildToC(container, currentloc + 1, currentloc, parentLocStack, headerList)
        }

        // when current is higher than last, create a sub-container in last, then append the current
        else if (currentLevel > lastLevel) {
            const $ul = document.createElement('ul')
            container.lastChild.appendChild($ul)

            // push a track point into track stack
            parentLocStack.push(currentloc - 1)

            buildToC($ul, currentloc, currentloc, parentLocStack, headerList)
        }

        // current is lower than last but also lower than or equal to parent,
        // rollback the last level loc track point
        else if (currentLevel < lastLevel) {
            const newlastloc = parentLocStack.pop()

            // reach to top container,
            // this happen when an article starts with high level header but lower level occurs later
            if (last(parentLocStack) === -1) {
                // push a track point into track stack, to create a new track
                parentLocStack.push(currentloc)
                buildToC(container.parentNode.parentNode, currentloc, currentloc, parentLocStack, headerList)
            }
            // still inside the toc child scope, find its grandparent container
            else {
                buildToC(container.parentNode.parentNode, currentloc, newlastloc, parentLocStack, headerList)
            }
        }
    }
})

function createHeaderIdIfNecessary(headers) {
    headers.forEach((header) => {
        if (!header.id) {
            header.id = 'atc-custom-header-id-' + headerUUID
            headerUUID += 1
        }
    })
}

function last(list) {
    return list[list.length - 1]
}

function createItem(currentHeader, options) {
    const $li = document.createElement('li')
    const $topic = $li.appendChild(document.createElement('a'))
    $li.classList.add(`__toc-${currentHeader.tagName.toLowerCase()}`)
    setTopicContent($topic, currentHeader, options.useInnerHTML)
    return $li
}

function getHeaderLevel($h) {
    if ($h.tagName.toLowerCase()[0] !== 'h') {
        return -1
    }
    return parseInt($h.tagName.slice(1), 10)
}

function preventParentScroll(element) {
    element.addEventListener('wheel', function (event) {
        event.currentTarget.scrollTop -= (event.wheelDeltaY || event.wheelDelta || 0);
        event.preventDefault();
    }, true)
}

function enableDetectingHistoryState() {
    function decorateHistory(type) {
        const orig = history[type];
        return function () {
            const rv = orig.apply(this, arguments);
            const e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    }

    history.pushState = decorateHistory('pushState')
    history.replaceState = decorateHistory('replaceState');
}

function setTopicContent($topic, $h, useInnerHTML) {
    if (useInnerHTML) {
        $topic.innerHTML = $h.innerHTML
        // remove external link in header html, just pure navigation
        $topic.querySelectorAll(anchorSelector)
            .forEach($anchor => {
                if ($anchor.innerText) {
                    const span = document.createElement('span')
                    span.innerHTML = $anchor.innerHTML
                    $anchor.parentNode.replaceChild(span, $anchor)
                } else {
                    $anchor.parentNode.removeChild($anchor)
                }
            })
    } else {
        $topic.innerText = $h.innerText
    }

    $topic.href = `#${($h.querySelector(anchorSelector) || $h).id}`
}

function getUserOption() {

}
