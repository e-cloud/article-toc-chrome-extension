export function enableDetectingHistoryState() {
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
