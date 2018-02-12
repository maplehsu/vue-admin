<template>
<div class="wrapper">
  <v-nav></v-nav>
  <div class="content">
    <v-header></v-header>
    <div class="main">
      <v-crumbs :sCrumbs="crumbs"></v-crumbs>
      <div class="padding">
        <div class="panel">
          <div class="panel-header">
            <div>
              <label class="ivu-label">项目名称：</label>
              <input type="text" style="width:200px" class="ivu-input" v-model="name" placeholder="项目名称">
              <label class="ivu-label" style="margin-left:20px">项目类型：</label>
              <template>
                <Select style="width:200px" v-model="competitionTypeID">
                  <Option v-for="item in expertList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </template>
              <label class="ivu-label" style="margin-left:20px">年度：</label>
              <template>
                <Select v-model="year" style="width:200px">
                  <Option v-for="item in yearList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </template>
            </div>
            <div class="mt-20">
              <label class="ivu-label" style="margin-left:20px">省份：</label>
              <template>
                <Select v-model="province" style="width:200px">
                  <Option v-for="item in provinceData" :value="item.ProvinceCode" :key="item.ProvinceCode">{{ item.ProvinceName }}</Option>
                </Select>
              </template>
              <label class="ivu-label" style="margin-left:20px">状态：</label>
              <template>
                <Select v-model="state" style="width:200px; margin-left:26px">
                  <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </template>
              <a class="btn btn-default ml-20" @click="search">查询</a>
            </div>
          </div>
          <div class="panel-body">
            <a class="btn btn-primary mb-20" @click="add">新增</a>
            <template><Table border :columns="columns" :data="tableData"></Table></template>
          </div>
          <div class="panel-footer center">
            <template><Page :total="total" :page-size="pageSize" @on-change="page"></Page></template>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import vHeader from "@/components/header";
import vNav from "@/components/nav";
import vCrumbs from "@/components/crumbs";
import modalForm from "@/components/formProject";

export default {
  components: {
    vHeader,
    vNav,
    vCrumbs
  },
  data() {
    return {
      crumbs: [
        {
          value: '项目展示',
          url: ''
        }
      ],
      stateList: [
        {
          value: "-1",
          label: "全部"
        },
        {
          value: "1",
          label: "启用"
        },
        {
          value: "0",
          label: "停用"
        }
      ],
      yearList: [
        {
          value: "2015",
          label: "2015"
        },
        {
          value: "1",
          label: "启用"
        },
        {
          value: "0",
          label: "停用"
        }
      ],
      columns: [
        {
          title: "项目名称",
          align: "center",
          key: "ProjectName"
        },
        {
          title: "项目类型",
          align: "center",
          key: "CompetitionTypeIDDesc"
        },
        {
          title: "年度",
          align: "center",
          key: "Year"
        },
        {
          title: "省份",
          align: "center",
          key: "ProvinceName"
        },
        {
          title: "时间段",
          key: "time",
          align: "center",
          width: 180
        },
        {
          title: "状态",
          align: "center",
          key: "StateDesc"
        },
        {
          title: "发布人",
          align: "center",
          key: "RealName"
        },
        {
          title: "创建时间",
          key: "CreateTime",
          align: "center",
          width: 180
        },
        {
          title: "操作",
          key: "active",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  class: "btn btn-primary",
                  on: {
                    click: () => {
                      this.edit(params);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确认操作这一条数据吗？"
                  },
                  on: {
                    'on-ok': () => {
                      this.states(params)
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small"
                      },
                      class: "btn btn-primary",
                      style: {
                        marginLeft: "10px",
                        marginRight: "10px"
                      }
                    },
                    this.stateValue(params)
                  )
                ]
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确认删除这条内容吗？"
                  },
                  on: {
                    "on-ok": () => {
                      this.remove(params);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        size: "small"
                      },
                      class: "btn btn-danger"
                    },
                    "删除"
                  )
                ]
              )
            ]);
          }
        }
      ],
      tableData: [],
      state: "-1",
      competitionTypeID: "-1",
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      expertList: [],
      province: "-1",
      provinceData: [],
      name: "",
      year: "-1",
      yearList: [],
      editData: {},
      addData: {},
      formData: {},
      formRef: "",
      loading: true
    };
  },
  mounted: function() {
    this.update();
    this.getYear();
    this.getProvince();
    this.projectType();
  },
  methods: {
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
            this.provinceData.unshift({
              ProvinceName: "全部",
              ProvinceCode: "-1"
            });
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
            this.expertList.push({ label: "全部", value: "-1" });
            res.data.Data.forEach(data => {
              this.expertList.push({ label: data.DicName, value: data.DicID });
            });
          }
        });
    },
    getYear: function() {
      this.yearList.push({ label: "全部", value: "-1" });
      for (let i = 2015; i <= 2030; i++) {
        this.yearList.push({ label: i, value: i });
      }
    },
    search: function() {
      this.axios
        .get(this.api.projectList, {
          params: {
            projectName: this.name,
            year: this.year,
            provinceID: this.province,
            competitionTypeID: this.competitionTypeID,
            state: this.state,
            page: this.pageIndex,
            limit: this.pageSize
          }
        })
        .then(res => {
          if (res.data.Success === true) {
            this.total = res.data.Data.Total;
            this.tableData = res.data.Data.List;
            this.tableData.forEach((data, index) => {
              this.tableData[index].time = `${data.BeginTimeDesc}至${
                data.EndTimeDesc
              }`;
            });
          }
        });
    },
    update: function() {
      this.axios
        .get(this.api.projectList, {
          params: {
            year: this.year,
            competitionTypeID: this.competitionTypeID,
            state: this.state,
            page: this.pageIndex,
            limit: this.pageSize
          }
        })
        .then(res => {
          if (res.data.Success === true) {
            this.total = res.data.Data.Total;
            this.tableData = res.data.Data.List;
            this.tableData.forEach((data, index) => {
              this.tableData[index].time = `${data.BeginTimeDesc}至${
                data.EndTimeDesc
              }`;
            });
          }
        });
    },
    stateValue: function(params) {
      if (params.row.State === 0) {
        return "启用";
      } else {
        if (params.row.State === 1) {
          return "停用";
        }
      }
    },
    add: function() {
      let _this = this;
      this.$Modal.confirm({
        loading: this.loading,
        render: (h, params) => {
          return h(modalForm, {
            on: {
              formData: data => {
                this.formData = data;
              },
              formRef: data => {
                this.formRef = data;
              }
            }
          });
        },
        onOk: function() {
          _this.formRef.validate(valid => {
            if (valid) {
              _this.formData.BeginTime = _this.formData.BeginTime.toLocaleDateString()
              _this.formData.EndTime = _this.formData.EndTime.toLocaleDateString()
              _this.axios.post(_this.api.projectAdd, _this.formData).then(res => {
                  if (res.data.Success === true) {
                    _this.update();
                    _this.$Modal.remove();
                    _this.$Message.success("添加成功");
                  } else {
                    _this.$Message.error(res.data.Msg);
                    this.buttonLoading = false;
                  }
                });
            } else {
              this.buttonLoading = false;
            }
          });
        }
      });
    },
    edit: function(params) {
      let _params = params;
      let _this = this;
      this.$Modal.confirm({
        loading: this.loading,
        render: (h, params) => {
          return h(modalForm, {
            props: {
              echoData: _params.row,
              isEdit: true
            },
            on: {
              formData: data => {
                this.editData = data;
                this.editData.ID = _params.row.ID;
              },
              formRef: data => {
                this.formRef = data;
              }
            }
          });
        },
        onOk: function() {
          _this.formRef.validate(valid => {
            if (valid) {
              _this.editData.BeginTime = _this.editData.BeginTime.toLocaleDateString();
              _this.editData.EndTime = _this.editData.EndTime.toLocaleDateString();
              _this.editData.ID = params.row.ID;
              _this.axios
                .post(_this.api.projectEdit, _this.editData)
                .then(res => {
                  if (res.data.Success === true) {
                    _this.update();
                    _this.$Modal.remove();
                    _this.$Message.success("修改成功");
                  } else {
                    this.$Message.error(res.data.Msg);
                    this.buttonLoading = false;
                  }
                });
            } else {
              this.buttonLoading = false;
            }
          });
        }
      });
    },
    states: function(params) {
      if (params.row.State === 1) {
        this.axios
          .post(this.api.projectState, {
            id: params.row.ID,
            state: false
          })
          .then(res => {
            if (res.data.Success === true) {
              this.update();
            } else {
              this.$Message.error(res.data.Msg)
            }
          });
      } else {
        if (params.row.State === 0) {
          this.axios
            .post(this.api.projectState, {
              id: params.row.ID,
              state: true
            })
            .then(res => {
              if (res.data.Success === true) {
                this.update();
              } else {
                this.$Message.error(res.data.Msg)
              }
            });
        }
      }
    },
    remove: function(params) {
      let _this = this;
      this.axios
        .post(this.api.projectDelete, {
          id: params.row.ID
        })
        .then(res => {
          if (res.data.Success === true) {
            this.update();
            _this.$Message.success("删除成功");
          } else {
            _this.$Message.error(res.data.Msg);
          }
        });
    },
    page: function(index) {
      this.pageIndex = index;
      this.axios
        .get(this.api.projectList, {
          params: {
            year: "-1",
            competitionTypeID: "-1",
            state: "-1",
            page: this.pageIndex,
            limit: this.pageSize
          }
        })
        .then(res => {
          if (res.data.Success === true) {
            this.total = res.data.Data.Total;
            this.tableData = res.data.Data.List;
            this.tableData.forEach((data, index) => {
              this.tableData[index].time = `${data.BeginTimeDesc}至${
                data.EndTimeDesc
              }`;
            });
          }
        });
    }
  }
};
</script>
