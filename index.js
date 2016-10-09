(root => {
	const HeaderRegExp = /h(\d)/i

	function getHeaderLevel($h) {
		const level = parseInt((($h.tagName).match(HeaderRegExp))[1], 10)
		return isNaN(level) ? undefined : level
	}

	const headerSelector = new Array(6)
		.fill(1)
		.reduce((acc, val, i) => {
			acc.push('h' + i)
			return acc
		}, [])
		.join(', ')

	const anchorSelector = 'a[id]'

	root.chrome.storage.sync.get({
		useInnerHTML: true
	}, (options) => {
		document.querySelectorAll('.markdown-body')
			.forEach(($article) => {
				const $headers = Array.from($article.querySelectorAll(headerSelector))

				const $container = document.createElement('div')
				$container.classList.add('__github-markdown-toc-container')

				const $outline = document.createElement('ul')
				$outline.classList.add('__github-markdown-toc')
				$container.appendChild($outline)

				buildToC($outline, null, 0, $headers)

				$article.insertBefore($container, $article.firstChild)
			})

		function buildToC(parent, lastloc, loc, context) {
			if (loc >= context.length) return

			if (!lastloc || context[loc].tagName === context[lastloc].tagName) {
				const $li = document.createElement('li')
				const $topic = $li.appendChild(document.createElement('a'))
				setTopicContent($topic, context[loc])

				parent.appendChild($li)

				buildToC(parent, lastloc || loc, loc + 1, context)
			} else if (getHeaderLevel(context[loc]) > getHeaderLevel(context[lastloc])) {
				const $ul = document.createElement('ul')
				parent.lastChild.appendChild($ul)

				buildToC($ul, null, loc, context)
			} else if (parent.parentNode) {
				buildToC(parent.parentNode, lastloc - 1, loc, context)
			}
		}

		function setTopicContent($topic, $h) {
			if (options.useInnerHTML) {
				$topic.innerHTML = $h.innerHTML
				// remove external link in header html, just pure navigation
				$topic.querySelectorAll(anchorSelector)
					.forEach($child => {
						$child.parentNode.removeChild($child)
					})
			} else {
				$topic.innerText = $h.innerText
			}

			$topic.href = `#${$h.querySelector(anchorSelector).id}`
		}
	})

})(this)
