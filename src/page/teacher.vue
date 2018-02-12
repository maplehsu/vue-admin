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
                <label class="ivu-label">关键字：</label>
                <input type="text" style="width:200px" class="ivu-input" v-model="name" placeholder="姓名、简介">
                <label class="ivu-label ml-20">专家分类：</label>
                <template>
                  <Select style="width:200px" v-model="expertTypeID">
                    <Option v-for="item in expertList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </template>
                <label class="ivu-label ml-20">状态：</label>
                <template>
                  <Select v-model="state" style="width:200px">
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
import modalForm from "@/components/formTeacher";

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
          value: '职教名师',
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
      columns: [
        {
          title: "姓名",
          align: "center",
          key: "Name"
        },
        {
          title: "头像",
          key: "ImgUrl",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Img", {
                props: {
                  size: "small"
                },
                attrs: {
                  src: process.env.API_IMG + params.row.ImgUrl,
                  style: "width: 50px; height: 50px;"
                }
              })
            ]);
          }
        },
        {
          title: "专业",
          align: "center",
          key: "Majors"
        },
        {
          title: "职称",
          align: "center",
          key: "JobTitle"
        },
        {
          title: "专家分类",
          align: "center",
          key: "ExpertType"
        },
        {
          title: "状态",
          align: "center",
          key: "StateDesc"
        },
        {
          title: "创建时间",
          width: 180,
          align: "center",
          key: "CreateTime"
        },
        {
          title: "操作",
          key: "active",
          align: "center",
          width: 250,
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
      expertTypeID: "-1",
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      expertList: [],
      name: '',
      formRef: '',
      modalWidth: "800px",
      loading: true
    };
  },
  mounted: function() {
    this.update();
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
          this.expertList.push({ label: "全部", value: "-1" });
          res.data.Data.forEach(data => {
            this.expertList.push({ label: data.DicName, value: data.DicID });
          });
        }
      });
  },
  methods: {
    search: function() {
      this.axios
        .get(this.api.teacherList, {
          params: {
            keyWork: this.name,
            state: this.state,
            expertTypeID: this.expertTypeID,
            page: this.pageIndex,
            limit: this.pageSize
          }
        })
        .then(res => {
          if (res.data.Success === true) {
            this.total = res.data.Data.Total;
            this.tableData = res.data.Data.List;
          }
        });
    },
    update: function() {
      this.axios
        .get(this.api.teacherList, {
          params: {
            state: this.state,
            page: this.pageIndex,
            limit: this.pageSize,
            keyWork: this.name,
            expertTypeID: this.expertTypeID
          }
        })
        .then(res => {
          if (res.data.Success === true) {
            this.total = res.data.Data.Total;
            this.tableData = res.data.Data.List;
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
        width: this.modalWidth,
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
              _this.axios
                .post(_this.api.teacherAdd, _this.formData)
                .then(res => {
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
        width: this.modalWidth,
        render: (h, params) => {
          return h(modalForm, {
            props: {
              echoData: _params.row.ID
            },
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
              _this.formData.ID = params.row.ID;
              _this.axios
                .post(_this.api.teacherEdit, _this.formData)
                .then(res => {
                  if (res.data.Success === true) {
                    _this.update();
                    _this.$Modal.remove();
                    _this.$Message.info("修改成功");
                  } else {
                    this.$Message.info(res.data.Msg);
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
          .post(this.api.teacherState, {
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
            .post(this.api.teacherState, {
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
        .post(this.api.teacherDelete, {
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
        .get(this.api.teacherList, {
          params: {
            state: "-1",
            page: this.pageIndex,
            limit: this.pageSize,
            keyWork: "",
            expertTypeID: "-1"
          }
        })
        .then(res => {
          if (res.data.Success === true) {
            this.total = res.data.Data.Total;
            this.tableData = res.data.Data.List;
          }
        });
    }
  }
};
</script>
<style scoped>
.search .btn {
  margin-left: 80px;
  margin-top: 20px;
}
</style>
