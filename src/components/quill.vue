<template>
  <quill-editor v-model="content" :options="editorOption" ref="quillEditor">
    <div id="toolbar" slot="toolbar">
      <button id="custom-button" @click="customButtonClick">[ Click m3e ]</button>
    </div>
  </quill-editor>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
export default {
  name: "quill",
  components: {
    quillEditor
  },
  data: function data() {
    return {
      content: `<h1 class="ql-align-center">xxx33333333x</h1>`,
      editorOption:  {
        modules: {
          toolbar: '#toolbar'
        }
      }
    }
  },
  methods: {
    customButtonClick: function () {
    }
  }
}
</script>
<style>
</style>
