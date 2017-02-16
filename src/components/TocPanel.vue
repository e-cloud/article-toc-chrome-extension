<template>
  <div class="toc-panel">
    <TocPanelHeader></TocPanelHeader>
    <ul class="toc-list" v-prevent-parent-scroll>
      <TreeViewRoot v-for="(rootNode, index) in treeList" :data-node="rootNode"></TreeViewRoot>
    </ul>
    <TocPanelFooter></TocPanelFooter>
  </div>
</template>

<script>
  import TreeViewRoot from './TreeViewRoot'
  import TocPanelFooter from './TocPanelFooter'
  import TocPanelHeader from './TocPanelHeader'

  export default {
    name: 'toc-panel',
    props: {
      treeList: {
        type: Array
      }
    },
    components: {
      TreeViewRoot,
      TocPanelFooter,
      TocPanelHeader
    },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
      };
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .toc-list {
    max-height: 500px;
    height: auto;
    max-width: 300px;
    overflow: auto;
  }
  .toc-list > .tree-view {
    list-style-type: none;
  }
</style>
