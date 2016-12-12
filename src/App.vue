<template>
  <div id="app">
    <img src="./assets/logo.png">
    <TocPanel></TocPanel>
  </div>
</template>

<script>
  import TocPanel from './components/TocPanel';

  export default {
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
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
