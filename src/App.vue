<template>
  <div id="__article-toc-extension_app__">
    <TocPanel :tree="appData"></TocPanel>
  </div>
</template>

<script>
  import TocPanel from './components/TocPanel';

  export default {
    props: ['appData'],
    name: 'app',
    components: {
      TocPanel,
    },
  };
</script>

<style>
  #__article-toc-extension_app__ {
    color: #2c3e50;
    position: fixed;
    z-index: 150000;
    right: 4px;
    bottom: 4px;
  }
</style>
