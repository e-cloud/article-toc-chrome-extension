import TreeNode from './TreeNode'

class TreeRoot extends TreeNode {
  constructor(treeId) {
    super(generateNodeId(treeId, 0))

    this.treeId = treeId
    this.nIdCache = this.nId = 0
    this.root = this

    this.setParent()
    super.setAsParent()
  }

  generateNodeId() {
    /* eslint no-plusplus:0 */
    this.nIdCache++
    return generateNodeId(this.treeId, this.nIdCache)
  }

  setParent() {
    this.parent = null
    this.level = -1
  }

  remove() {
    throw Error(`Can't not remove virtual root: ${this.treeId}`)
  }

  toString() {
    return `This is virtual root of tree [${this.treeId}].`
  }
}

function generateNodeId(treeId, nId) {
  return `${treeId}_${nId}`
}

export default TreeRoot
