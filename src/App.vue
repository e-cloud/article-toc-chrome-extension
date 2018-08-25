<template>
  <div id="__article-toc-extension_app__">
    <TocPanel :tree="appData"></TocPanel>
    <button v-on:click="closeTOC()">close</button>
  </div>
</template>

<script>
  import TocPanel from './components/TocPanel'
  import pubsub from './util/pubsub'

  export default {
    props: ['appData'],
    name: 'app',
    components: {
      TocPanel,
    },
    methods: {
      closeTOC() {
        pubsub.publish('closeTOC')
      }
    }
  }
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
