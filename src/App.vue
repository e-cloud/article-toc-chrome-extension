<template>
  <div id="app">
    <TocPanel :tree-list="appData"></TocPanel>
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
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  #app {
    position: fixed;
    z-index: 1500;
    right: 0;
    bottom: 0;
    /* overflow: auto; */
    background-color: white;
    border: 1px solid grey;
    box-shadow: 0 0 10px grey;
  }
</style>
