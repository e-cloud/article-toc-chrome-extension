import Vue from 'vue';
import App from './App';
import '../sample/frameworks-cb4ede7df6d8670c4051172e4d6bc6916b3c765fa15b4ee9b348f157fdb85114.css'
import '../sample/github-f32b0e7dbc73ab49677d48d959274568a459569efc1cf486e83fe9aed5890998.css'

/* eslint-disable no-new */
const instance = new Vue({
  template: '<App/>',
  components: { App },
  created() {
    // console.log(this);
  },
});

window.addEventListener('load', () => {
  document.querySelectorAll('article')
    .forEach(($article) => {
      const $container = document.createElement('div')
      $container.id = 'app'
      $article.prepend($container)
      instance.$mount($container)
    })
})
