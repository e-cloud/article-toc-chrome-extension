<template>
  <div class="toc-panel">
    <TocPanelHeader></TocPanelHeader>
    <ul class="toc-list">
      <TreeView v-for="(rootNode, index) in treeList" :data-node="rootNode">
      </TreeView>
    </ul>
    <TocPanelFooter></TocPanelFooter>
  </div>
</template>

<script>
  import TreeView from './TreeView'
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
      TreeView,
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

</style>
