/* eslint-disable no-param-reassign */
export default function preventParentScroll(element) {
  let needRAF = true
  let delta = 0
  let currentTarget = null
  element.addEventListener('wheel', function listener(event) {
    delta += (event.wheelDeltaY || event.wheelDelta || 0) / 6

    if (needRAF) {
      needRAF = false
      currentTarget = event.currentTarget
      requestAnimationFrame(function () {
        currentTarget.scrollTop -= delta
        delta = 0
        needRAF = true
      })
    }

    event.preventDefault();
  }, true)
}
