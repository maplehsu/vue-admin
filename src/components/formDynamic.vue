<template>
  <Form :model="formItem" :rules="ruleValidate" :label-width="60" ref="formItem" id="form" enctype="multipart/form-data">
    <FormItem label="标题" prop="Title">
      <Input v-model="formItem.Title"></Input>
    </FormItem>
    <FormItem label="查看数" prop="BrowseCount">
      <Input v-model="formItem.BrowseCount"></Input>
    </FormItem>
    <FormItem label="赞数" prop="PraiseCount">
      <Input v-model="formItem.PraiseCount"></Input>
    </FormItem>
    <FormItem label="封面" prop="ImgUrl" class="tooltip-box">
      <template>
        <Input v-model="formItem.ImgUrl" class="hide"></Input>
        <Upload ref="upload" :format="['jpg','jpeg','png']" :max-size="512000" :action="url" :headers="header" :data="params" :before-upload="upload" :on-success="success" :on-remove="remove">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传封面</Button>
        </Upload>
        <i class="help">建议尺寸283*200</i>
        <img :src="preview" style="width: 80px; 80px" v-show="visible">
      </template>
    </FormItem>
    <FormItem label="内容" prop="Content">
      <Input v-model="formItem.Content" class="hide"></Input>
      <VueEditor @ready="editorReady"></VueEditor>
    </FormItem>
    <a @click="closeModal" class="btn-close-modal"><Icon type="close-round"></Icon></a>
  </Form>
</template>
<script>
import VueEditor from 'vue-ueditor'
export default {
  components: {
    VueEditor
  },
  data: function() {
    return {
      editorError: false,
      preview: '',
      visible: false,
      formItem: {
        ID: '',
        Title: '',
        PraiseCount: '',
        BrowseCount: '',
        ImgUrl: '',
        Content: ''
      },
      params: {
        type: "3"
      },
      header: {
        contentType: "multipart/form-data",
        token: localStorage.getItem('token')
      },
      url: this.api.upload,
      ruleValidate: {
        Title: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur"
          }
        ],
        ImgUrl: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        PraiseCount: [
          { required: true, validator: this.G.validateNumber, trigger: "blur" }
        ],
        BrowseCount: [
          { required: true, validator: this.G.validateNumber, trigger: "blur" }
        ],
        Content: [{ required: true, message: "不能为空", trigger: "change" }]
      }
    };
  },
  props: {
    echoData: {},
    isEdit: false
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
    },
    upload: function(file) {
      this.$refs.upload.clearFiles()
      let data = new FormData(document.getElementById("form"))
      data.append("fileImage", file);
    },
    success: function(res, file) {
      this.$set(this.formItem, "ImgUrl", res.Data)
      this.visible = true
      this.preview = process.env.API_IMG + res.Data
    },
    remove: function(file) {
      this.$set(this.formItem, "ImgUrl", "")
      this.visible = false
      this.preview = ''
    },
    editorReady: function (editorInstance) {
      if (this.formItem.Content != '') {
        editorInstance.setContent(this.formItem.Content)
      }
      editorInstance.addListener('contentChange', () => {
        this.$set(this.formItem, 'Content', editorInstance.getContent())
      });
    }
  },
  mounted: function() {
    console.log(this);
    if (this.isEdit) {
      this.formItem = Object.assign(this.formItem, this.echoData)
      this.preview = process.env.API_IMG + this.echoData.ImgUrl
      this.visible = true
      this.formRef()
      this.formSubmit()
    } else {
      this.formRef()
      this.formSubmit()
    }
  }
};
</script>
<style scoped>

</style>
