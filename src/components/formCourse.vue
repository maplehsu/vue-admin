<template>
  <Form :model="formItem" :rules="ruleValidate" :label-width="80" ref="formItem" id="form">
    <FormItem label="数据名称" prop="CourseTypeName">
      <Input v-model="formItem.CourseTypeName"></Input>
    </FormItem>
    <a @click="closeModal" class="btn-close-modal"><Icon type="close-round"></Icon></a>
  </Form>
</template>
<script>
export default {
  data: function() {
    return {
      formItem: {
        parentID: '',
        CourseTypeName: ''
      },
      ruleValidate: {
        CourseTypeName: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {
    echoData: {}
  },
  methods: {
    closeModal: function () {
      this.$Modal.remove()
    },
    formRef: function() {
      this.$emit("formRef", this.$refs["formItem"])
    },
    formSubmit: function() {
      this.$emit("formData", this.formItem);
    }
  },
  mounted: function() {
    this.formItem = Object.assign(this.formItem, this.echoData)
    this.formRef()
    this.formSubmit()
  }
};
</script>
<style scoped>

</style>
