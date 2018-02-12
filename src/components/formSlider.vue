<template>
  <Form :model="formItem" id="form" :rules="ruleValidate" :label-width="90"  ref="formItem">
    <FormItem label="轮播图名称" prop="Name">
      <Input v-model="formItem.Name"></Input>
    </FormItem>
    <FormItem label="排序序号" prop="Sort">
      <Input v-model="formItem.Sort"></Input>
    </FormItem>
    <FormItem label="链接地址" prop="Url">
      <Input v-model="formItem.Url"></Input>
    </FormItem>
    <FormItem label="有效时间" class="ivu-form-item-required">
      <template>
        <Row>
          <Col span="11">
            <FormItem prop="BeginTime">
              <DatePicker type="date"  v-model="formItem.BeginTime" placeholder="开始时间"></DatePicker>
            </FormItem>
          </Col>
          <Col span="2" class="center">
            至
          </Col>
          <Col span="11">
            <FormItem prop="EndTime">
              <DatePicker type="date" v-model="formItem.EndTime" placeholder="结束时间"></DatePicker>
            </FormItem>
          </Col>
        </Row>
      </template>
    </FormItem>
    <FormItem label="上传图片" prop="ImgUrl" class="tooltip-box">
      <template>
        <Input v-model="formItem.ImgUrl" class="hide"></Input>
        <Upload ref="upload" :format="['jpg','jpeg','png']" :max-size="512000" :action="url" :headers="header" :data="params" :before-upload="upload" :on-remove="remove" :on-success="success">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传封面</Button>
        </Upload>
        <i class="help">建议尺寸1920*550</i>
        <img ref="im" style="width:50px;height:50px;" src="" v-show="visible">
      </template>
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
        Name: "",
        BeginTime: "",
        EndTime: "",
        Url: "",
        Sort: "",
        ImgUrl: ""
      },
      visible: false,
      params: {
        type: "1"
      },
      header: {
        contentType: "multipart/form-data",
        token: localStorage.getItem('token')
      },
      url: this.api.uploadSlider,
      ruleValidate: {
        Name: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur"
          }
        ],
        Sort: [
          {
            required: true,
            pattern: /^[0-9]*$/,
            message: "不是数字",
            trigger: "blur"
          }
        ],
        Url: [
          {
            validator: this.G.validateUrl,
            trigger: "blur"
          }
        ],
        BeginTime: [
          {
            type: "date",
            required: true,
            message: "不能为空",
            trigger: "change"
          }
        ],
        EndTime: [
          {
            type: "date",
            required: true,
            message: "不能为空",
            trigger: "change"
          },
          {
            _this: this,
            validator: this.G.validateDate,
            message: "结束时间不应该小于开始时间",
            trigger: "change"
          }
        ],
        ImgUrl: [{ required: true, message: "不能为空", trigger: "change" }]
      }
    };
  },
  props: {
    isEdit: false,
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
    },
    upload: function(file) {
      this.$refs.upload.clearFiles()
      let data = new FormData(document.getElementById("form"));
      data.append("fileImage", file);
    },
    success: function(res, file) {
      this.visible = true
      this.$set(this.formItem, "ImgUrl", res.Data.resultUrl);
      this.$refs.im.src = process.env.API_IMG + res.Data.ImgShowUrl;
    },
    remove: function(file) {
      this.$set(this.formItem, "ImgUrl", "");
      this.$refs.im.src = "";
      this.visible = false
    }
  },
  mounted: function() {
    if (this.isEdit) {
      this.axios
        .post(this.api.sliderById + "?id=" + this.echoData.ID)
        .then(res => {
          if (res.data.Success === true) {
            this.$refs.im.src = process.env.API_IMG + this.echoData.ImgUrl
            this.visible = true
            this.formItem = Object.assign(this.formItem, res.data.Data)
            this.formRef()
            this.formSubmit()
          } else {
            this.$Message.error(res.data.Msg)
          }
        });
    } else {
      this.formItem = Object.assign(this.formItem, this.echoData);
      this.formRef();
      this.formSubmit();
    }
  }
};
</script>
<style scoped>

</style>
