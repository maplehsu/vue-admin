<template>
  <Form :model="formItem" :rules="ruleValidate" :label-width="80" ref="formItem" id="form" enctype="multipart/form-data">
    <FormItem label="姓名" prop="Name">
      <Input v-model="formItem.Name"></Input>
    </FormItem>
    <FormItem label="专业" prop="Majors">
      <Input v-model="formItem.Majors"></Input>
    </FormItem>
    <FormItem label="职称" prop="JobTitleID">
      <template>
        <Select v-model="formItem.JobTitleID">
          <Option v-for="item in jobList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </template>
    </FormItem>
    <FormItem label="工作单位" prop="WorkUnit">
      <Input v-model="formItem.WorkUnit"></Input>
    </FormItem>
    <FormItem label="专家分类" prop="ExpertTypeID">
      <template>
        <Select v-model="formItem.ExpertTypeID">
          <Option v-for="item in expertList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </template>
    </FormItem>
    <FormItem label="专家头像" prop="ImgUrl" class="tooltip-box">
      <template>
        <Input v-model="formItem.ImgUrl" class="hide"></Input>
        <Upload ref="upload" :format="['jpg','jpeg','png']" :max-size="512000" :action="url" :headers="header" :data="params" :before-upload="upload" :on-success="success" :on-remove="remove">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传头像</Button>
        </Upload>
        <i class="help">建议尺寸100*100</i>
        <img :src="preview" style="width: 80px; 80px" v-show="visible">
      </template>
    </FormItem>
    <FormItem label="专家简介" prop="ExpertIntroduction">
      <Input v-model="formItem.ExpertIntroduction" class="hide"></Input>
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
      formItem: {
        ID: "",
        Name: "",
        ImgUrl: "",
        Majors: "",
        JobTitleID: null,
        ExpertTypeID: null,
        WorkUnit: "",
        ExpertIntroduction: ""
      },
      preview: "",
      visible: false,
      editor: "",
      params: {
        type: "4"
      },
      jobList: [
        {
          label: "请选择",
          value: -1
        }
      ],
      expertList: [
        {
          label: "请选择",
          value: -1
        }
      ],
      header: {
        contentType: "multipart/form-data",
        token: localStorage.getItem('token')
      },
      url: this.api.upload,
      ruleValidate: {
        Name: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ],
        Majors: [
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ],
        WorkUnit: [
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ],
        ExpertTypeID: {
          required: true,
          message: "专家分类不能为空",
          trigger: "change",
          type: "number"
        },
        ImgUrl: [
          { required: true, message: "专家头像不能为空", trigger: "change" }
        ],
        ExpertIntroduction: [
          { required: true, message: "不能为空", trigger: "change" }
        ]
      }
    };
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
      this.$set(this.formItem, "ImgUrl", res.Data);
      this.visible = true;
      this.preview = process.env.API_IMG + res.Data;
    },
    remove: function(file) {
      this.$set(this.formItem, "ImgUrl", "");
      this.visible = false;
      this.preview = "";
    },
    editorReady: function (editorInstance) {
      if (this.formItem.ExpertIntroduction != '') {
        editorInstance.setContent(this.formItem.ExpertIntroduction)
      }
      editorInstance.addListener('contentChange', () => {
        this.$set(this.formItem, 'ExpertIntroduction', editorInstance.getContent())
      });
    }
  },
  props: {
    echoData: null
  },
  mounted: function() {
    this.axios
      .get(this.api.dictionaryManage, {
        params: {
          tableName: "TC_Dic_JobTitle",
          dicName: "",
          State: "1"
        }
      })
      .then(res => {
        if (res.data.Success === true) {
          res.data.Data.forEach(data => {
            this.jobList.push({ label: data.DicName, value: data.DicID });
          });
        } else {
          this.$Message.error(res.data.Msg);
        }
      });
    this.axios
      .get(this.api.dictionaryManage, {
        params: {
          tableName: "TC_Dic_VocationalEduExpertType",
          dicName: "",
          State: "1"
        }
      })
      .then(res => {
        if (res.data.Success === true) {
          res.data.Data.forEach(data => {
            this.expertList.push({ label: data.DicName, value: data.DicID });
          });
        }
      });
    if (this.echoData != null) {
      this.axios
        .post(this.api.teacherEcho, {
          id: this.echoData
        })
        .then(res => {
          if (res.data.Success === true) {
            this.formItem = res.data.Data;
            this.formSubmit();
            this.formRef();
            this.visible = true;
            this.preview = process.env.API_IMG + res.data.Data.ImgUrl;
          } else {
            this.$Message.info(res.data.Msg);
          }
        });
    } else {
      this.formRef();
      this.formSubmit();
    }
  }
};
</script>
<style scoped>
</style>
