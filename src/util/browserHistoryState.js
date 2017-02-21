export default function enableDetectingHistoryState() {
  function decorateHistory(type) {
    const orig = history[type];
    return function (...args) {
      const rv = orig.apply(this, args);
      const e = new Event(type);
      e.arguments = args;
      window.dispatchEvent(e);
      return rv;
    };
  }

  history.pushState = decorateHistory('pushState')
  history.replaceState = decorateHistory('replaceState');
}
