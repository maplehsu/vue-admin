
<template>
  <Form :model="formItem" :rules="ruleValidate" :label-width="80" ref="formItem" id="form" enctype="multipart/form-data">
    <FormItem label="标题" prop="Title">
      <Input v-model="formItem.Title"></Input>
    </FormItem>
    <FormItem label="标签">
      <Input v-model="formItem.Label"></Input>
    </FormItem>
    <FormItem label="排序序号" prop="Sort">
      <Input v-model="formItem.Sort"></Input>
    </FormItem>
    <FormItem label="封面" prop="ImgUrl" class="tooltip-box">
      <template>
        <Input v-model="formItem.ImgUrl" class="hide"></Input>
        <Upload ref="upload" :format="['jpg','jpeg','png']" :max-size="1" :action="url" :headers="header"  :data="params" :before-upload="uploadImage" :on-success="successImage" :on-remove="removeImg">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传封面</Button>
        </Upload>
        <i class="help">建议尺寸283*200</i>
        <img :src="preview" style="width: 80px; 80px" v-show="visible">
      </template>
    </FormItem>
    <FormItem label="视频" class="tooltip-box">
      <template>
        <Input v-model="formItem.VideoUrl" class="hide"></Input>
        <Upload ref="uploadVideo" :on-exceeded-size="handleMaxSize" :format="['mp4']" :max-size="512000" :action="urlVideo" :headers="header" :data="params" :before-upload="uploadVideo" :on-format-error="handleFormatError" :on-success="successVideo" :on-remove="removeVideo">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传视频</Button>
        </Upload>
        <i class="video-name" v-show="isName"><i class="ivu-icon ivu-icon-ios-film"></i>{{videoName}}</i>
        <div class="ivu-form-item-error-tip" v-show="videoTip">{{videoTipContent}}</div>
        <i class="help">必须mp4格式，500M以下</i>
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
  data: function () {
    return {
      preview: '',
      videoName: '',
      isName: false,
      videoTip: false,
      videoTipContent: '',
      visible: false,
      formItem: {
        Title: '',
        Type: 1,
        VideoUrl: '',
        CompetitionTypeID: null,
        Label: '',
        Sort: '',
        ImgUrl: '',
        Content: '',
        ID: 0
      },
      editor: '',
      params: {
        'type': '5'
      },
      editorOption: this.G.editorOption,
      header: {
        contentType: "multipart/form-data",
        token: localStorage.getItem('token')
      },
      url: this.api.upload,
      urlVideo: this.api.uploadFile,
      ruleValidate: {
        Title:[
          { required: true, message: "标题不能为空", trigger: "blur" },
          { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur"}
        ],
        Sort:[
          { required: true, validator: this.G.validateNumber, trigger: "blur" }
        ],
        ImgUrl: [
          { required: true, message: "封面不能为空", trigger: "change" }
        ],
        Content: [
          { required: true, message: "不能为空", trigger: "change" }
        ]
      }
    }
  },
  props: {
    echoData: null
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
    },
    uploadImage: function (file) {
      this.$refs.upload.clearFiles()
      let data = new FormData(document.getElementById('form'))
      data.append('fileImage', file)
    },
    successImage: function (res, file) {
      this.$set(this.formItem, "ImgUrl", res.Data)
      this.visible = true
      this.preview = process.env.API_IMG + res.Data
    },
    uploadVideo: function (file) {
      this.$refs.uploadVideo.clearFiles()
      let data = new FormData(document.getElementById('form'))
      data.append('fileVideo', file)
    },
    successVideo: function (res, file) {
      this.isName = false
      this.videoTip = false
      this.$set(this.formItem, "VideoUrl", res.Data)
    },
    removeImg:function(){
      this.$set(this.formItem, "ImgUrl", "")
      this.visible = false
      this.preview = ''
    },
    removeVideo:function(){
      this.$set(this.formItem, "VideoUrl", "")
    },
    handleMaxSize (file) {
      this.videoTipContent = '上传视频大小要小于或等于500M'
      this.videoTip = true
    },
    handleFormatError (file) {
      this.videoTipContent = '上传视频格式有误，请重新上传mp4格式视频'
      this.videoTip = true
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
  mounted: function () {
    if (this.echoData != null) {
      this.axios.post(this.api.competitionEcho, {
        'id': this.echoData
      }).then(res => {
        if (res.data.Success === true) {
          this.formItem = res.data.Data
          this.$set(this, 'editor', this.formItem.Content)
          this.formSubmit()
          this.formRef()
          this.visible = true
          this.preview = process.env.API_IMG + res.data.Data.ImgUrl
          if (this.formItem.VideoUrl != '') {
            this.isName = true
            this.videoName = this.formItem.VideoUrl.match(/([^_]+)$/)[1]
          }
        } else {
          this.$Message.info(res.data.Msg)
        }
      })
    } else {
      this.formRef()
      this.formSubmit()
    }
  }
}
</script>
<style scoped>
</style>
