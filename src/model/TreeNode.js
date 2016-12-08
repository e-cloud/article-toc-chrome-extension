import * as _ from 'lodash'

class TreeNode {
  constructor(id) {
    this.setTId(id)

    /**
     * @member children
     * @type {Array<TreeNode>}
     */
    this.children = null
    this.parent = null

    this.isFirst = false
    this.isLast = false
  }

  setTId(id) {
    /**
     * the identity field for reference inside the library, dataNode should
     * not have the same field. It's unique inside a treeInstance
     * @member tId
     * @type string
     */
    this.tId = id
    return this
  }

  setData(data) {
    this.data = data
    return this
  }

  setRoot(root) {
    this.root = root
    return this
  }

  getParent() {
    return this.parent
  }

  setParent(parentNode) {
    if (!(parentNode instanceof TreeNode)) throw Error('parent shouldn\'t be null.')

    /**
     * @member parent
     * @type TreeNode
     */
    this.parent = parentNode

    this.level = parentNode.level + 1
    return this
  }

  getLevel() {
    return this.level
  }

  getChildIndex(node) {
    // todo: here may use lodash for more flexible search
    return this.children.indexOf(node)
  }

  getChildAt(index) {
    return this.children[index]
  }

  getPrevSibling() {
    if (this.isFirstChild()) return null
    return this.parent.getChildAt(this.parent.getChildIndex(this) - 1)
  }

  getNextSibling() {
    if (this.isLastChild()) return null
    return this.parent.getChildAt(this.parent.getChildIndex(this) + 1)
  }

  getChildren() {
    return this.children
  }

  getPath() {
    let path

    if (this.parent) {
      path = this.parent.getPath()
    }
    else {
      path = []
    }

    path.push(this)

    return path
  }

  isFirstChild() {
    return this.isFirst
  }

  isLastChild() {
    return this.isLast
  }

  isLeaf() {
    return isNullOrUndefined(this.children)
  }

  setAsLeaf() {
    this.children = null
    return this
  }

  setAsParent() {
    this.children = []
    return this
  }

  clone() {
    return new TreeNode(this.tId, this.parent)
  }

  addChild(...nodes) {
    if (this.getLastChild()) this.getLastChild().resetOrderState()

    nodes.forEach((node) => {
      node.setParent(this)
    })

    this.children.push(...nodes)

    this.resetChildrenOrderState()

    return this
  }

  insertChild(index, ...nodes) {
    if (this.getFirstChild()) this.getFirstChild().resetOrderState()
    if (this.getLastChild()) this.getLastChild().resetOrderState()

    nodes.forEach((node) => {
      node.setParent(this)
    })

    this.children.splice(index, 0, ...nodes)

    this.resetChildrenOrderState()

    return this
  }

  setFirst() {
    this.isFirst = true
    return this
  }

  setLast() {
    this.isLast = true
    return this
  }

  resetOrderState() {
    this.isFirst = false
    this.isLast = false
    return this
  }

  resetChildrenOrderState() {
    this.getFirstChild().setFirst()
    this.getLastChild().setLast()
    return this
  }

  getFirstChild() {
    return this.children[0]
  }

  getLastChild() {
    return this.children[this.children.length - 1]
  }

  /**
   *
   * @param {TreeNode} node
   * @returns {TreeNode}
   */
  removeChild(node) {
    if (node.isFirstChild() || node.isLastChild()) node.resetOrderState()

    _.pull(this.children, node)

    if (this.children.length) this.resetChildrenOrderState()

    return this
  }

  /**
   *
   * @param {number} index
   */
  removeChildAt(index) {
    if (this.getChildAt(index)) this.getChildAt(index).resetOrderState()

    _.pullAt(this.children, index)

    if (this.children.length) this.resetChildrenOrderState()

    return this
  }

  removeAllChildren() {
    this.children.length = 0
    return this
  }

  /**
   * remove from parent
   */
  remove() {
    this.parent.removeChild(this)
    return this
  }

  destroy() {
    this.removeAllChildren()
    this.parent = null
    this.data = null
  }

  /* toString() {
   return this.tId
   } */
}

function isNullOrUndefined(value) {
  return value === undefined || value === null
}

export default TreeNode
