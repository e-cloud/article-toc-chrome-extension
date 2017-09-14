<template>
  <div class="toc-panel">
    <TocPanelHeader></TocPanelHeader>
    <ul class="toc-container" v-prevent-parent-scroll>
      <TreeViewRoot :data-node="tree"></TreeViewRoot>
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
      tree: {
        type: Object
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
  .toc-container {
    max-height: 500px;
    height: auto;
    max-width: 300px;
    overflow: auto;
  }
  .tree-view {
    list-style-type: none;
  }
</style>
