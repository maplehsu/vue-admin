<template>
  <Form :model="formItem" :label-width="100" :rules="ruleValidate" ref="formItem" id="form" enctype="multipart/form-data">
    <FormItem label="课程编码" prop="Code">
      <Input v-model="formItem.Code"></Input>
    </FormItem>
    <FormItem label="课程名称" prop="Name">
      <Input v-model="formItem.Name"></Input>
    </FormItem>
    <FormItem label="课程分类" prop="CourseType">
      <RadioGroup v-model.number="formItem.CourseType" @on-change="courseSelect">
        <Radio label="0">通识课</Radio>
        <Radio label="1">专业课</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="课程类型" v-if="course === true" prop="FirstCourseTypeID">
      <template>
        <Select v-model="formItem.FirstCourseTypeID" @on-change="courseChildData">
          <Option v-for="item in firstCourseList" :value="item.ID" :key="item.ID">{{ item.CourseTypeName}}</Option>
        </Select>
      </template>
    </FormItem>
    <FormItem label=""  v-if="courseChild === true" prop="SecondCourseTypeID">
      <template>
        <Select v-model="formItem.SecondCourseTypeID" class="mt-20">
          <Option v-for="item in secondCourseList" :value="item.ID" :key="item.ID">{{ item.CourseTypeName}}</Option>
        </Select>
      </template>
    </FormItem>
    <FormItem label="推荐设置" prop="IsRecommend">
      <template>
        <Select v-model="formItem.IsRecommend">
          <Option v-for="item in recommendList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </template>
    </FormItem>
    <FormItem label="排序序号" prop="Sort">
      <Input v-model="formItem.Sort"></Input>
    </FormItem>
    <FormItem label="查看数" prop="BrowseCount">
      <Input v-model="formItem.BrowseCount"></Input>
    </FormItem>
    <FormItem label="赞数" prop="PraiseCount">
      <Input v-model="formItem.PraiseCount"></Input>
    </FormItem>
    <FormItem label="课程封面" prop="ImgUrl" class="tooltip-box">
      <template>
        <Input v-model="formItem.ImgUrl" class="hide"></Input>
        <Upload ref="upload" :format="['jpg','jpeg','png']" :max-size="512000" :action="url" :headers="header" :data="params" :before-upload="uploadImage" :on-success="successImage" :on-remove="removeImage">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传封面</Button>
        </Upload>
        <i class="help">建议尺寸283*200</i>
        <img :src="preview" style="width: 80px; 80px" v-show="visible">
      </template>
    </FormItem>
    <FormItem label="上传视频" prop="VideoUrl" class="tooltip-box">
      <template>
        <Input v-model="formItem.VideoUrl" class="hide"></Input>
        <Upload ref="uploadVideo" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :format="['mp4']" :max-size="512000" :action="urlVideo" :headers="header"  :data="params" :before-upload="uploadVideo" :on-success="successVideo" :on-remove="removeVideo">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传视频</Button>
        </Upload>
        <i class="video-name" v-show="isName"><i class="ivu-icon ivu-icon-ios-film"></i>{{videoName}}</i>
        <div class="ivu-form-item-error-tip" v-show="videoTip">{{videoTipContent}}</div>
        <i class="help">必须mp4格式，500M以下</i>
      </template>
    </FormItem>
    <a @click="closeModal" class="btn-close-modal"><Icon type="close-round"></Icon></a>
  </Form>
</template>
<script>
export default {
  data: function () {
    return {
      preview: '',
      videoName: '',
      isName: false,
      visible: false,
      videoTip: false,
      videoTipContent: '',
      close: '',
      formItem: {
        ID: 0,
        Code: '',
        Name: '',
        ImgUrl: '',
        VideoUrl: '',
        CourseType: 0,
        FirstCourseTypeID: null,
        SecondCourseTypeID: '-1',
        BrowseCount: '',
        PraiseCount: '',
        IsRecommend: null,
        Sort: ''
      },
      params: {
        'type': '2'
      },
      recommendList: [
        {
          value: 'true',
          label: '是'
        },
        {
          value: 'false',
          label: '否'
        }
      ],
      ruleValidate: {
        Code:[
          { required: true, message: "不能为空", trigger: "blur" },
          { min: 1, max: 200, message: "长度在 1 到 200 个字符", trigger: "blur"}
        ],
        Name:[
          { required: true, message: "不能为空", trigger: "blur" },
          { min: 1, max: 200, message: "长度在 1 到 200 个字符", trigger: "blur"}
        ],
        Sort:[
          { required: true, validator: this.G.validateNumber, trigger: "blur" }
        ],
        CourseType: {required: true, message: "不能为空", trigger: "change", type: 'number'},
        IsRecommend: {required: true, message: "不能为空", trigger: "change", type: 'string'},
        FirstCourseTypeID: { required: true, message: "不能为空", trigger: "change", type: 'number'},
        SecondCourseTypeID: { required: true, message: "不能为空", trigger: "change", type: 'number'},
        BrowseCount:[
          { required: true, validator: this.G.validateNumber, trigger: "blur" }
        ],
        PraiseCount:[
          { required: true, validator: this.G.validateNumber, trigger: "blur" }
        ],
        ImgUrl: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        VideoUrl: [
          { required: true, message: "不能为空", trigger: "change" },
          { min: 1, max: 200, message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ],
        Content: [
          { required: true, message: "不能为空", trigger: "change" }
        ]
      },
      course: false,
      courseChild: false,
      firstCourseList: [],
      secondCourseList: [],
      header: {
        contentType: "multipart/form-data",
        token: localStorage.getItem('token')
      },
      url: this.api.upload,
      urlVideo: this.api.uploadFile
    }
  },
  props: {
    echoData: null
  },
  methods: {
    closeModal: function () {
      this.$Modal.remove()
    },
    courseSelect: function (params) {
      if (params === '1') {
        this.course = true
        this.courseData()
      } else {
        this.courseChild = false
        this.course = false
        this.firstCourseList = []
        this.secondCourseList = []
        this.formItem.FirstCourseTypeID = null
        this.formItem.SecondCourseTypeID = null
      }
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
    removeImage: function(file) {
      this.$set(this.formItem, "ImgUrl", "")
      this.visible = false
      this.preview = ''
    },
    handleMaxSize (file) {
      this.videoTipContent = '上传视频大小要小于或等于500M'
      this.videoTip = true
    },
    handleFormatError (file) {
      this.videoTipContent = '上传视频格式有误，请重新上传mp4格式视频'
      this.videoTip = true
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
    removeVideo: function(file) {
      this.$set(this.formItem, "VideoUrl", "")
    },
    formRef: function() {
      this.$emit("formRef", this.$refs["formItem"])
    },
    courseData: function () {
      this.axios.get(this.api.courseList, {
        params: {
          'courseTypeName': '',
          'state': '1',
          'parentID': '0'
        }
      }).then(res => {
        if (res.data.Success === true) {
          this.firstCourseList = res.data.Data
        }
      })
    },
    courseChildData: function (params) {
      if (params !== '') {
        this.axios.get(this.api.courseList, {
          params: {
            'courseTypeName': '',
            'state': '1',
            'parentID': params
          }
        }).then(res => {
          if (res.data.Success === true) {
            if (res.data.Data.length === 0) {
              this.courseChild = false
              this.secondCourseList = ''
            } else {
              this.secondCourseList = res.data.Data
              this.courseChild = true
            }
          }
        })
      }
    }
  },
  mounted: function () {
    if (this.echoData != null) {
      this.courseData()
      this.axios.post(this.api.courseExperienceEcho, {
        'id': this.echoData
      }).then(res => {
        if (res.data.Success === true) {
          if (res.data.Data.CourseType === 1) {
            this.courseChildData(res.data.Data.FirstCourseTypeID)
            this.course = true
            this.courseChild = true
            this.formItem = res.data.Data
            this.visible = true
            this.preview = process.env.API_IMG + res.data.Data.ImgUrl
            this.$set(this.formItem, 'IsRecommend', res.data.Data.IsRecommend.toString())
            this.isName = true
            this.videoName = this.formItem.VideoUrl.match(/([^_]+)$/)[1]
            this.formSubmit()
            this.formRef()
          } else {
            this.visible = true
            this.preview = process.env.API_IMG + res.data.Data.ImgUrl
            this.formItem = res.data.Data
            this.isName = true
            this.videoName = this.formItem.VideoUrl.match(/([^_]+)$/)[1]
            this.$set(this.formItem, 'IsRecommend', res.data.Data.IsRecommend.toString())
            this.formSubmit()
            this.formRef()
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
