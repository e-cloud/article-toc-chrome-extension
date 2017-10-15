<template>
  <li class="tree-view">
    <a class="toc-link" :href="'#' + href" @click.prevent="scrollIntoView()">{{ title }}</a>
    <ul class="sub-tree-list" v-if="dataNode.children">
      <TreeView v-for="(treeNode, index) in dataNode.children" :key="treeNode.tId" :data-node="treeNode"></TreeView>
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
      }
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
<style scoped>
  .tree-view {
    margin-left: 1.5em;
  }

  .toc-link {
    font-size: 1.2rem;
  }
</style>
