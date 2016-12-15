<template>
  <li class="tree-view">
    <a :href="'#' + href">{{ title }}</a>
    <ul class="sub-tree-list" v-if="dataNode.children">
      <TreeView v-for="(treeNode, index) in dataNode.children" :data-node="treeNode"></TreeView>
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
  .tree-view {
    margin-left: 1.5em;
  }
</style>
