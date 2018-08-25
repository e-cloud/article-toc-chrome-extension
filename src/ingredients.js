import Vue from 'vue';

import App from './App';
import { grabArticle, remapOriginalElements } from './util/extractArticle';
import extractTree, { extractHeaders } from './util/extractTreeData';

export const containerId = '__article-toc-extension__'
export const indicatorId = '__article-toc-extension_indicator__';
export const stautsId = 'grab-status';

export function buildPluginContainer() {
  const $container = document.createElement('div');
  $container.id = containerId;
  return $container;
}

export function buildPluginIndicator() {
  const $indicator = document.createElement('div');
  $indicator.id = indicatorId;
  $indicator.classList.add('loading');

  [1, 2, 3, 4].forEach((val) => {
    const cube = document.createElement('div');
    cube.classList.add('sk-cube', `sk-cube${val}`);
    $indicator.appendChild(cube);
  });

  return $indicator;
}

export function buildArticleStatus(articleFound) {
  const statusCont = document.createElement('div');
  const statusBar = document.createElement('div');
  const viewBtn = document.createElement('button');

  statusCont.classList.add('grab-status');
  statusBar.classList.add('status-bar');
  viewBtn.classList.add('view-btn');

  viewBtn.innerHTML = '&#10004;';

  statusCont.id = stautsId;
  statusCont.style.display = 'none';

  statusCont.appendChild(statusBar);

  if (!articleFound) {
    statusCont.classList.add('no-article-found');
    statusCont.setAttribute('title', 'Sorry, no article found(based on config)');
  }
  else {
    statusCont.setAttribute('title', 'click to open TOC');
    statusCont.appendChild(viewBtn);
  }

  return statusCont;
}

export function removeIndicator() {
  const $indicator = document.getElementById(indicatorId);
  $indicator.parentNode.removeChild($indicator);
}

export function rolloutIndicator() {
  return new Promise((resolve) => {
    const $indicator = document.getElementById(indicatorId);

    const indicatorAni = $indicator.animate([
      { transform: 'translateX(0) rotate(0)' },
      { transform: 'translateX(200%) rotate(1080deg)' },
    ], 2000);

    indicatorAni.onfinish = function () {
      $indicator.style.display = 'none';

      resolve();
    };
  });
}

export function bounceInStatus() {
  return new Promise((resolve) => {
    const $status = document.getElementById(stautsId);
    $status.style.display = '';

    const statusAni = $status.animate([
      { transform: 'translateX(100%)' },
      { transform: 'translateX(0)' },
    ], {
      duration: 1000,
      easing: 'cubic-bezier(.36,-0.54,.79,1.57)',
    });

    statusAni.onfinish = function () {
      resolve();
    };
  });
}

export function bindClickEvent(element, callback) {
  let listener;
  element.addEventListener('click', listener = (event) => {
    event.preventDefault();
    event.stopPropagation();

    element.removeEventListener('click', listener);
    callback();
  });
}

export function getHeaderTree() {
  const result = grabArticle();
  const headers = remapOriginalElements(extractHeaders(result.target), result.sourceTree, result.clonedTree);

  return [headers, extractTree(headers)];
}

export function initApp(tree) {
  return new Vue({
    template: '<App :app-data="tree"/>',
    components: { App },
    data() {
      return {
        tree,
      };
    },
    created() {
      // console.log(this);
    },
  });
}
