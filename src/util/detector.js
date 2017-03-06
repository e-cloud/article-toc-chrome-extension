import store from '../model/storage'

export function parseLocation() {
  const location = window.location

  return location.host
}

export function detect() {
  const host = parseLocation()
  return store.hasRule(host) ? store.getRule(host) : false;
}
