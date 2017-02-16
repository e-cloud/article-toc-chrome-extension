import Vue from 'vue'
import App from './App'
import extractTree from './extractTreeData'
import './directives/preventParentScroll.directive'


export default function () {
  const $articles = Array.from(document.querySelectorAll('article'))
  const treeList = $articles
    .map($article => extractTree($article))

  return initApp(buildPluginContainer(), treeList)
}

function buildPluginContainer() {
  const $container = document.createElement('div')
  $container.id = '__article-toc-extension__'
  return document.body.appendChild($container)
}

function initApp($container, treeList) {
  const instance = new Vue({
    el: $container,
    template: '<App :app-data="treeList"/>',
    components: { App },
    data() {
      return {
        treeList
      }
    },
    created() {
      // console.log(this);
    },
  });

  return instance
}
