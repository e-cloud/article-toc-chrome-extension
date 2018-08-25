import Vue from 'vue'
import preventParentScroll from '../util/preventParentScroll'

Vue.directive('preventParentScroll', {
  bind(el, binding, vnode) {
    vnode.context.listenerDisposer = preventParentScroll(el) // eslint-disable-line
  },
  unbind(el, binding, vnode) {
    vnode.context.listenerDisposer()
  }
})
