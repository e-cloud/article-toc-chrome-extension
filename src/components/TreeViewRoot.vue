<template>
  <li class="tree-view-root">
    <ul class="sub-tree-list" v-if="dataNode.children">
      <TreeView v-for="(treeNode) in dataNode.children" :key="treeNode.tId" :data-node="treeNode"></TreeView>
    </ul>
  </li>
</template>

<style>
  .tree-view-root .sub-tree-list {
    padding: 0;
  }
</style>

<script>
  import TreeNode from '../model/TreeNode'
  import TreeView from './TreeView'

  export default {
    props: {
      dataNode: {
        type: TreeNode
      }
    },
    components: {
      TreeView
    },
    name: 'TreeViewRoot',
    data() {
      return {}
    },
  };
</script>
