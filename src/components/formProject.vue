<template>
  <Form :model="formItem" :label-width="80" :rules="ruleValidate" ref="formItem" id="form" enctype="multipart/form-data">
    <FormItem label="项目名称" prop="ProjectName">
      <Input v-model="formItem.ProjectName"></Input>
    </FormItem>
    <FormItem label="年度" prop="Year">
      <template>
        <Select v-model.number="formItem.Year">
          <Option v-for="item in yearList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </template>
    </FormItem>
    <FormItem label="省份" prop="ProvinceID">
      <template>
        <Select v-model.number="formItem.ProvinceID">
          <Option v-for="item in provinceData" :value="item.ProvinceCode" :key="item.ProvinceCode">{{ item.ProvinceName }}</Option>
        </Select>
      </template>
    </FormItem>
    <FormItem label="项目类型" prop="CompetitionTypeID">
      <template>
        <Select v-model="formItem.CompetitionTypeID">
          <Option v-for="item in competitionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </template>
    </FormItem>
    <FormItem label="时间段" class="ivu-form-item-required">
      <template>
        <Row>
          <Col span="11">
          <FormItem prop="BeginTime">
            <DatePicker type="date" v-model="formItem.BeginTime" placeholder="开始时间"></DatePicker>
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
    <FormItem label="项目地址" prop="Address">
      <Input v-model="formItem.Address"></Input>
    </FormItem>
    <a @click="closeModal" class="btn-close-modal"><Icon type="close-round"></Icon></a>
  </Form>
</template>
<script>
export default {
  data: function() {
    return {
      formItem: {
        ID: "",
        ProjectName: "",
        Year: null,
        ProvinceID: null,
        CompetitionTypeID: null,
        BeginTime: "",
        EndTime: "",
        Address: ""
      },
      competitionList: [],
      provinceData: [],
      yearList: [],
      header: { contentType: "multipart/form-data" },
      url: this.api.upload,
      ruleValidate: {
        ProjectName: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ],
        CompetitionTypeID: [
          {required: true,  message: "职称不能为空", trigger: "change",type: 'number'}
        ],
        Year: [
          {
            required: true,
            type: "number",
            message: "不能为空",
            trigger: "change"
          }
        ],
        ProvinceID: [
          {
            type: "integer",
            required: true,
            message: "不能为空",
            trigger: "change"
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
        Address: [
          {
            validator: this.G.validateUrl,
            trigger: "blur"
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
        ]
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
    getProvince: function() {
      this.axios
        .get(this.api.provinceList, {
          params: {
            pageSize: "100",
            page: "1"
          }
        })
        .then(res => {
          if (res.data.Success === true) {
            this.provinceData = res.data.Data.List;
          }
        });
    },
    projectType: function() {
      this.axios
        .get(this.api.dictionaryManage, {
          params: {
            tableName: "TC_Dic_VocationaleduProjectType",
            dicName: "",
            State: "1"
          }
        })
        .then(res => {
          if (res.data.Success === true) {
            res.data.Data.forEach(data => {
              this.competitionList.push({
                label: data.DicName,
                value: data.DicID
              });
            });
          }
        });
    },
    getYear: function() {
      for (let i = 2015; i <= 2030; i++) {
        this.yearList.push({ label: i, value: i });
      }
    },
    _getProvince() {
      return this.axios.get(this.api.provinceList, {
        params: {
          pageSize: "100",
          page: "1"
        }
      });
    },
    _getProjectType() {
      return this.axios.get(this.api.dictionaryManage, {
        params: {
          tableName: "TC_Dic_VocationaleduProjectType",
          dicName: "",
          State: "1"
        }
      });
    }
  },
  mounted: function() {
    let _this = this;
    this.getYear()
    if (this.isEdit) {
      this.axios.all([this._getProvince(), this._getProjectType()]).then(
        this.axios.spread(function(p, t) {
          if (p.data.Success === true) {
            _this.provinceData = p.data.Data.List;
          }
          if (t.data.Success === true) {
            t.data.Data.forEach(data => {
              _this.competitionList.push({
                label: data.DicName,
                value: data.DicID
              });
            });
          }
          _this.axios
            .post(_this.api.projectById + "?id=" + _this.echoData.ID)
            .then(res => {
              if (res.data.Success === true) {
                _this.formItem = Object.assign(_this.formItem, res.data.Data);
              } else {
                _this.$Message.error(res.data.Msg);
              }
            });
        })
      );
    } else {
      this.getProvince();
      this.projectType();
      this.formItem = Object.assign(this.formItem, this.echoData);
    }
    this.formRef();
    this.formSubmit();
  }
};
</script>
<style scoped>

</style>
