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
            <div class="search flex">
              <label class="ivu-label">问题：</label>
              <input type="text" class="ivu-input" v-model="name">
              <label class="ivu-label ml-20"">状态：</label>
              <template>
                <Select v-model="state" style="width:200px">
                  <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </template>
              <a class="btn btn-default" @click="search">查询</a>
            </div>
          </div>
          <div class="panel-body">
            <a class="btn btn-primary mb-20" @click="add">新增</a>
            <router-link :to="{path: 'faqReclassify'}"><a class="btn btn-default mb-20 ml-20">返回</a></router-link>
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
import modalForm from "@/components/formFaqManage";

export default {
  name: "",
  components: {
    vHeader,
    vNav,
    vCrumbs,
    modalForm
  },
  data() {
    return {
      crumbs: [
        {
          value: '常见问题',
          url: ''
        },
        {
          value: '常见问题分类',
          url: 'faqClassify'
        },
        {
          value: '子分类管理',
          url: 'faqReclassify'
        },
        {
          value: '问题管理',
          url: ''
        }
      ],
      state: "-1",
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
      name: "",
      parentId: "0",
      tableName: "",
      columns: [
        {
          title: "问题",
          key: "Questions",
          align: "center"
        },
        {
          title: "排序序号  ",
          key: "Sort",
          align: "center"
        },
        {
          title: "状态",
          key: "StateName",
          align: "center"
        },
        {
          title: "创建时间",
          key: "CreateTime",
          align: "center"
        },
        {
          title: "操作",
          key: "active",
          align: "center",
          width: 500,
          render: (h, params) => {
            this.isShowButton();
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
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      formRef: "",
      loading: true,
      btnDelete: "",
      isDeleteShow: true,
      modalWidth: "800px"
    };
  },
  mounted: function() {
    this.parentId = localStorage.getItem("faqTwoId");
    this.update();
  },
  methods: {
    isShowButton: function() {
      if (this.isDeleteShow === true) {
        return (this.btnDelete = "Button");
      } else {
        return (this.btnDelete = "");
      }
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
    update: function() {
      this.axios.get(this.api.faqManageList, {
          params: {
            type: this.parentId,
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        }).then(res => {
          if (res.data.Success === true) {
            this.total = res.data.Data.Total;
            this.tableData = res.data.Data.List;
          }
        });
    },
    search: function() {
      this.axios
        .get(this.api.faqManageList, {
          params: {
            state:this.state,
            keyWrod: this.name,
            type: this.parentId,
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          if (res.data.Success === true) {
            this.total = res.data.Data.Total;
            this.tableData = res.data.Data.List;
          }
        });
    },
    add: function() {
      let _this = this;
      this.$Modal.confirm({
        loading: this.loading,
        width: this.modalWidth,
        render: h => {
          return h(modalForm, {
            on: {
              formData: data => {
                this.addData = data;
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
              _this.addData.Type = _this.parentId;
              _this.axios
                .post(this.api.faqManageAdd, _this.addData)
                .then(res => {
                  if (res.data.Success === true) {
                    _this.update();
                    _this.$Modal.remove();
                    _this.$Message.success("添加成功");
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
    edit: function(params) {
      let _params = params;
      let _this = this;
      this.$Modal.confirm({
        loading: this.loading,
        width: this.modalWidth,
        render: h => {
          return h(modalForm, {
            props: {
              echoData: _params.row.Id
            },
            on: {
              formData: data => {
                this.addData = data;
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
              _this.addData.Type = _this.parentId;
              _this.axios
                .post(_this.api.faqManageEdit, _this.addData)
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
          .post(this.api.faqManageState, {
            id: params.row.Id,
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
            .post(this.api.faqManageState, {
              id: params.row.Id,
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
        .post(this.api.faqManageDelete, {
          id: params.row.Id
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
        .get(this.api.faqManageList, {
          params: {
            type: this.parentId,
            name: "",
            state: -1,
            page: this.pageIndex,
            pageSize: this.pageSize
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
.search label {
  margin-right: 10px;
  margin-top: 10px;
}

.search input {
  width: 200px;
}

.search .btn {
  padding: 9px 25px;
  margin-left: 15px;
}
</style>
