<template>
  <li class="tree-view">
    <div>{{ getTitle() }}</div>
    <ul class="sub-tree-list" v-if="dataNode.children">
      <li v-for="(treeNode, index) in dataNode.children">
        <TreeView :data-node="treeNode"></TreeView>
      </li>
    </ul>
  </li>
</template>

<script>
  import TreeNode from '../model/TreeNode'

  export default {
    props: {
      dataNode: {
        type: TreeNode
      }
    },
    name: 'TreeView',
    data() {
      return {
        getTitle() {
          if (this.dataNode && this.dataNode.data.header) {
            return this.dataNode.data.header.innerText
          }
          return ''
        }
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
