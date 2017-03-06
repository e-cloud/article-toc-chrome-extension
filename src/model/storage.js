class Storage {
  constructor() {
    this.store = {}
  }

  addRule(domain, rule) {
    this.store[domain] = rule
  }

  removeRule(domain) {
    delete this.store[domain]
  }

  hasRule(domain) {
    return !!this.store[domain]
  }

  getRule(domain) {
    return this.store[domain]
  }
}

export default new Storage()
