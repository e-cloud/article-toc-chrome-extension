export default function preventParentScroll(element) {
  element.addEventListener('wheel', function (event) {
    event.currentTarget.scrollTop -= (event.wheelDeltaY || event.wheelDelta || 0);
    event.preventDefault();
  }, true)
}
