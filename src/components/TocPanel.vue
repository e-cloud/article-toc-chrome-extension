<template>
  <div class="toc-panel">
    <ul class="toc-container" v-prevent-parent-scroll>
      <TreeViewRoot :data-node="tree"></TreeViewRoot>
    </ul>
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
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @mixin webkit-scrollbar($width: 5px, $baseColor: #ccc) {
    ::-webkit-scrollbar {
      background-color: transparent;

      &:vertical {
        width: $width;
      }

      &:horizontal {
        height: $width;
      }

    }

    ::-webkit-scrollbar-track {
      background-color: transparent;

      &:hover {
        border-radius: 3px;
        background-color: transparentize($baseColor, 0.7);
        box-shadow: inset 0 0 10px transparentize($baseColor, 0.8);
      }
    }

    ::-webkit-scrollbar-thumb {
      transition: all 300ms ease-in-out;
      border-radius: 3px;
      background-color: transparentize($baseColor, 0.5);

      &:window-inactive {
        background-color: transparent;
      }

      &:hover {
        background-color: darken($baseColor, 10%);
      }
    }
  }

  .toc-panel {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 0 8px 1px rgba(196, 196, 196, 0.62);
    display: flex;
    overflow: hidden;

    &:before {
      content: ' ';
      display: block;
      width: 10px;
      background-color: steelblue;
    }

    @include webkit-scrollbar();
  }

  .toc-container {
    max-height: 500px;
    height: auto;
    max-width: 300px;
    overflow: auto;
    margin: 8px 0;
    padding: 0;
    list-style-type: none;
  }
</style>
