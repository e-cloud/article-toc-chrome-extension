/* eslint-disable camelcase */

import StateMachine from 'javascript-state-machine';
import capitalize from 'lodash-es/capitalize';
import {
  bindClickEvent,
  bounceInStatus,
  buildArticleStatus,
  buildPluginContainer,
  buildPluginIndicator,
  getHeaderTree,
  initApp,
  removeIndicator,
  rolloutIndicator,
} from './ingredients';
import pubsub from './util/pubsub';

const state_setup = capitalize('Setup');
const state_article_grabbed = capitalize('ArticleGrabbed');
const state_status_shown = capitalize('StatusShown');
const state_toc_shown = capitalize('TOCShown');

const trans_grab = capitalize('Grab');
const trans_animate_indicator = capitalize('AnimateIndicator');
const trans_open_click = capitalize('OpenClick');
const trans_close_click = capitalize('CloseClick');

const onBefore = 'onBefore';
const onLeave = 'onLeave';
const onEnter = 'onEnter';
const onAfter = 'onAfter';

export const fsm = new StateMachine({
  transitions: [
    { name: 'init', from: 'none', to: state_setup },
    { name: trans_grab, from: state_setup, to: state_article_grabbed },
    { name: trans_animate_indicator, from: state_article_grabbed, to: state_status_shown },
    { name: trans_open_click, from: state_status_shown, to: state_toc_shown },
    { name: trans_close_click, from: state_toc_shown, to: state_status_shown },
  ],
  data: {
    container: null,
    statusView: null,
    headerTree: null,
    app: null,
    articleFound: false,
  },
  methods: {
    [onEnter + state_setup]() {
      // build container
      this.container = buildPluginContainer();

      document.body.appendChild(this.container);
    },
    [onBefore + trans_grab]() {
      // build and show indicator
      const $indicator = buildPluginIndicator();
      this.container.appendChild($indicator);
    },
    [onEnter + state_article_grabbed]() {
      // grab article
      return new Promise((resolve) => {
        const [headers, tree] = getHeaderTree();

        this.headerTree = tree;
        this.articleFound = headers.length >= 3;

        setTimeout(resolve, 3000);
      });
    },
    [onBefore + trans_animate_indicator]() {
      // build floating status
      const $status = buildArticleStatus(this.articleFound);

      this.statusView = $status;

      this.container.appendChild($status);
    },
    [onLeave + state_article_grabbed]() {
      // animate indicator
      return rolloutIndicator();
    },
    [onEnter + state_status_shown]() {
      // animate status
      return bounceInStatus();
    },
    [onAfter + trans_animate_indicator]() {
      // remove indicator
      removeIndicator();
    },
    [onBefore + trans_open_click]() {
      if (!this.articleFound) {
        return false;
      }

      // bind click event
      return new Promise((resolve) => {
        bindClickEvent(this.statusView.querySelector('.view-btn'), resolve);
      });
    },
    [onEnter + state_toc_shown]() {
      // init/show toc app
      this.app = initApp(this.headerTree);
      this.app.$mount()
      this.container.appendChild(this.app.$el)
      this.statusView.style.display = 'none'
    },
    [onBefore + trans_close_click]() {
      // bind click event
      return new Promise((resolve) => {
        const token = pubsub.subscribe('closeTOC', () => {
          pubsub.unsubscribe(token);
          resolve();
        });
      });
    },
    [onLeave + state_toc_shown]() {
      // hide toc app
      this.app.$destroy();
      this.container.removeChild(this.app.$el)
      this.app = null;
    },
    onAfterTransition() {
      setTimeout(() => {
        const transitions = this.transitions();
        if (transitions.length === 1) {
          this[transitions[0].toLowerCase()]();
        }
      });
    },
  },
});
