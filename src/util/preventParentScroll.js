/* eslint-disable no-param-reassign */
export default function preventParentScroll(element) {
  element.addEventListener('wheel', function listener(event) {
    event.currentTarget.scrollTop -= (event.wheelDeltaY || event.wheelDelta || 0) / 4;
    console.log('wheel')
    event.preventDefault();
  }, true)
}
