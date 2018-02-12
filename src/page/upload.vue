<template>
  <div>
    <VueEditor @ready="editorReady"></VueEditor>
  </div>
</template>
<script>
import VueEditor from 'vue-ueditor'
export default {
  name: "",
  components: {
    VueEditor
  },
  data: function data() {
    return {
      url: this.api.upload
    }
  },
  methods: {
    editorReady (editorInstance) {
      editorInstance.setContent('Hello world!<br>你可以在这里初始化编辑器的初始内容。');
      editorInstance.addListener('contentChange', () => {
        console.log('编辑器内容发生了变化：', editorInstance.getContent());
      });
    }
  }
}
</script>
<style>
</style>
