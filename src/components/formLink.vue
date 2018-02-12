<template>
  <Form :model="formItem" :rules="ruleValidate" :label-width="100" ref="formItem" id="form" enctype="multipart/form-data">
    <FormItem label="友情链接名称" prop="LinkName">
      <Input v-model="formItem.LinkName"></Input>
    </FormItem>
    <FormItem label="排序序号" prop="Sort">
      <Input v-model="formItem.Sort"></Input>
    </FormItem>
    <FormItem label="链接地址" prop="Url">
      <Input v-model="formItem.Url"></Input>
    </FormItem>
    <a @click="closeModal" class="btn-close-modal"><Icon type="close-round"></Icon></a>
  </Form>
</template>
<script>
export default {
  data: function() {
    return {
      formItem: {
        ID: 0,
        LinkName: "",
        Sort: '',
        Url: ""
      },
      ruleValidate: {
        LinkName: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur"
          }
        ],
        Sort: [
          { required: true, validator: this.G.validateNumber, trigger: "blur" }
        ],
        Url: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
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
      this.$emit("formRef", this.$refs["formItem"]);
    },
    formSubmit: function() {
      this.$emit("formData", this.formItem);
    }
  },
  mounted: function() {
    this.formItem = Object.assign(this.formItem, this.echoData);
    this.formRef();
    this.formSubmit();
  }
};
</script>
<style scoped>

</style>
