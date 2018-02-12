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
              <label class="ivu-label">二级分类名称：</label>
              <input type="text" class="ivu-input" v-model="name">
              <label class="ivu-label ml-20">状态：</label>
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
            <router-link :to="{path: 'faqClassify'}"><a class="btn btn-default mb-20 ml-20">返回</a></router-link>
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
import modalForm from "@/components/formFaq";

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
          title: "二级分类名称",
          key: "Name",
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
          width: 300,
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
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    marginLeft: "10px"
                  },
                  class: "btn btn-primary",
                  on: {
                    click: () => {
                      this.$router.push({ name: "faqManage" });
                      localStorage.setItem("faqTwoId", params.row.Id);
                    }
                  }
                },
                "问题管理"
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
      isDeleteShow: true
    };
  },
  mounted: function() {
    this.parentId = localStorage.getItem("faqId");
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
      this.axios
        .get(this.api.faqList, {
          params: {
            parentId: this.parentId,
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
    search: function() {
      this.axios
        .get(this.api.faqList, {
          params: {
            name: this.name,
            state: this.state,
            page: this.pageIndex,
            pageSize: this.pageSize,
            parentId: this.parentId
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
        render: h => {
          return h(modalForm, {
            props: {
              title: "二级分类名称"
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
              _this.addData.ParentID = _this.parentId;
              _this.axios.post(this.api.faqAdd, _this.addData).then(res => {
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
        render: h => {
          return h(modalForm, {
            props: {
              echoData: _params.row,
              title: "二级分类名称"
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
              _this.addData.ID = params.row.Id;
              _this.axios.post(_this.api.faqEdit, _this.addData).then(res => {
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
          .post(this.api.faqState, {
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
            .post(this.api.faqState, {
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
        .post(this.api.faqDelete, {
          id: params.row.Id,
          parentId: 0
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
        .get(this.api.faqList, {
          params: {
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
