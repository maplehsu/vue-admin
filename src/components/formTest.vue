<template>
  <div ref="div">
    <!-- <quill></quill> -->
  </div>
</template>
<script>
import quill from '@/components/quill'
import Vue from 'vue'
export default {
  components: {
    quill
  },
  data: function() {
    return {

    }
  },
  mounted: function () {
    console.log(1);
    var edit = new Vue(quill)
    console.log(quill);
    edit.$mount(this.$refs.div)
  }
};
</script>
<style scoped>

</style>
