import store from './storage'
import ParseRule from './ParseRule'

const defaultRules = {
  'github.com': new ParseRule(),
  'gist.github.com': new ParseRule(),
  'medium.com': new ParseRule()
}

export default function () {
  Object.keys(defaultRules).forEach((key) => {
    if (!store.hasRule(key)) {
      store.addRule(key, defaultRules[key])
    }
  })
}
