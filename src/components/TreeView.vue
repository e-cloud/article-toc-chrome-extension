<template>
  <li class="tree-view" :class="{ 'link-referable': linkReferable }">
    <div class="tree-item-content">
      <a class="toc-link text-truncate" :title="title" :href="'#' + href" @click.prevent="scrollIntoView()">{{ title }} </a>
    </div>

    <ul class="sub-tree-list" v-if="dataNode.children">
      <TreeView v-for="(treeNode) in dataNode.children" :key="treeNode.tId" :data-node="treeNode"></TreeView>
    </ul>
  </li>
</template>

<script>
  import TreeNode from '../model/TreeNode'

  const anchorSelector = 'a[id]'

  let customId = 0

  export default {
    props: {
      dataNode: {
        type: TreeNode
      },
    },
    name: 'TreeView',
    computed: {
      header() {
        if (this.dataNode && this.dataNode.data.header) {
          return this.dataNode.data.header
        }
        return null
      },
      title() {
        if (this.header) {
          return this.header.innerText
        }
        return ''
      },
      href() {
        if (this.header) {
          const aLink = this.header.querySelector(anchorSelector)

          let id = aLink ? aLink.id : this.header.id

          if (!id) {
            // eslint-disable-next-line
            this.header.id = `toc-id-${customId++}`
            id = this.header.id
          }

          return id
        }
        return ''
      },
      linkReferable() {
        return !this.href.startsWith('toc-id');
      }
    },
    methods: {
      scrollIntoView() {
        document.getElementById(this.href).scrollIntoViewIfNeeded(true)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .tree-view {
    margin-left: 1.2rem;
    list-style-type: none;
    font-size: 1rem;
  }

  .link-referable {
    list-style-image: url("../assets/link.svg");
  }

  .tree-item-content {
    position: relative;
  }

  .toc-link {
    font-size: 1rem;
    max-width: 12em;
    display: inline-block;
    vertical-align: middle;
    line-height: 1.15;
    color: #444;

    &:hover {
      text-decoration: underline;
    }
  }

  .text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
