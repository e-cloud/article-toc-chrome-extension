const positionRules = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'left-center',
  'right-center'
]

export default class ParseRule {
  constructor(pos = 'bottom-right', selector = 'article', width = 300, height = 500) {
    this.position = pos
    this.setSelector(selector)
    this.setSize(width, height)
  }

  set position(pos) {
    if (positionRules.includes(pos)) {
      this.innerPosition = pos
      return
    }

    throw new Error('Invalid position.')
  }

  get position() {
    return this.innerPosition
  }

  setSelector(rule) {
    this.articleSelector = rule.toString()
  }

  setSize(width, height) {
    this.size = {
      width,
      height
    }
  }
}
