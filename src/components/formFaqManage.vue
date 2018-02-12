<template>
  <Form :model="formItem" :rules="ruleValidate" :label-width="75" ref="formItem">
    <FormItem label="问题" prop="Questions">
      <Input v-model="formItem.Questions"></Input>
    </FormItem>
    <FormItem label="排序序号" prop="Sort">
      <Input v-model="formItem.Sort"></Input>
    </FormItem>
    <FormItem label="答案" prop="AnswerContent">
      <quill-editor v-model="formItem.AnswerContent" :options="editorOption"></quill-editor>
    </FormItem>
    <i class="hint">富文本内插入的图片宽度建议小于850px</i>
    <a @click="closeModal" class="btn-close-modal"><Icon type="close-round"></Icon></a>
  </Form>
</template>
<script>
export default {
  data: function () {
    return {
      formItem: {
        Type: 0,
        Questions: '',
        AnswerContent: '',
        Sort: ''
      },
      editorOption: this.G.editorOption,
      ruleValidate: {
        Questions: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ],
        AnswerContent: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        Sort: [
          { required: true, validator: this.G.validateNumber, trigger: "blur" }
        ]
      }
    }
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
  props: {
    echoData: null
  },
  mounted: function () {
    if (this.echoData != null) {
      this.axios.post(this.api.faqManageEcho, {
        'ID': this.echoData
      }).then(res => {
        if (res.data.Success === true) {
          this.formItem = res.data.Data
          this.formSubmit()
          this.formRef()
        } else {
          this.$Message.error(res.data.Msg)
        }
      })
    } else {
      this.formSubmit()
      this.formRef()
    }
  }
}
</script>
<style scoped>
.hint {
  font-style: normal;
  font-size: 12px;
  color: #F5D67C;
  margin-left: 70px;
}
</style>
