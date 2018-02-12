<template>
  <Form :model="formItem" :rules="ruleValidate" :label-width="100" ref="formItem">
    <FormItem :label="title" prop="Name">
      <Input v-model="formItem.Name"></Input>
      <i class="hint">建议长度8个字以内</i>
    </FormItem>
    <FormItem label="排序序号" prop="Sort">
      <Input v-model="formItem.Sort"></Input>
    </FormItem>
    <a @click="closeModal" class="btn-close-modal"><Icon type="close-round"></Icon></a>
  </Form>
</template>
<script>
export default {
  data: function () {
    return {
      formItem: {
        ID: 0,
        Name: '',
        Sort: '',
        ParentID: 0
      },
      ruleValidate: {
        Name: [
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
        ]
      }
    }
  },
  props: {
    echoData: {},
    title: ''
  },
  methods: {
    closeModal: function () {
      this.$Modal.remove()
    },
    formRef: function() {
      this.$emit("formRef", this.$refs["formItem"])
    },
    formSubmit: function () {
      this.$emit('formData', this.formItem)
    }
  },
  mounted: function () {
    this.formItem = Object.assign(this.formItem, this.echoData)
    this.formSubmit()
    this.formRef()
  }
}
</script>
<style scoped>
  .hint {
    font-style: normal;
    font-size: 12px;
    color: #F5D67C;
  }
</style>
