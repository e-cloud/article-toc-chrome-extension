import Vue from 'vue'
import App from './App'
import './directives/preventParentScroll.directive'
import { grabArticle, remapOriginalElements } from './util/extractArticle'
import extractTree, { extractHeaders } from './util/extractTreeData'

export default function bootstrap() {
  const result = grabArticle()
  // eslint-disable-next-line
  const originalTarget = result.sourceTree.get(result.clonedTree.get(result.target))
  // eslint-disable-next-line
  const headers = remapOriginalElements(extractHeaders(result.target), result.sourceTree, result.clonedTree)

  return initApp(buildPluginContainer(), extractTree(headers))
}

function buildPluginContainer() {
  const $container = document.createElement('div')
  $container.id = '__article-toc-extension__'
  return document.body.appendChild($container)
}

function initApp($container, tree) {
  const instance = new Vue({
    el: $container,
    template: '<App :app-data="tree"/>',
    components: { App },
    data() {
      return {
        tree
      }
    },
    created() {
      // console.log(this);
    },
  })

  return instance
}
