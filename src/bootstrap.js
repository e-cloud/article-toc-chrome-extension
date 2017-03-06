import Vue from 'vue'
import App from './App'
import extractTree from './util/extractTreeData'
import './directives/preventParentScroll.directive'
// import { detect } from './util/detector'
import setDefaultRules from './model/defaults'

setDefaultRules()

export default function searchArticles() {
  // const rule = detect()
  const rule = { articleSelector: 'article' }
  const $articles = Array.from(document.querySelectorAll(rule.articleSelector))
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
