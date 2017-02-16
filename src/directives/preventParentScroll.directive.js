import Vue from 'vue'
import preventParentScroll from '../util/preventParentScroll'

Vue.directive('preventParentScroll', {
  bind(el) {
    el.dataset.listener = preventParentScroll(el) // eslint-disable-line
  },
  unbind(el) {
    el.removeEventListener(el.dataset.listener)
  }
})
