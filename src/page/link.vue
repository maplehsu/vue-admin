<template>
<div class="wrapper">
  <v-nav></v-nav>
  <div class="content">
    <v-header></v-header>
    <div class="main">
      <v-crumbs :sCrumbs="crumbs"></v-crumbs>
      <div class="padding">
        <div class="panel">
          <div class="panel-body">
            <a class="btn btn-primary mb-20" @click="add">新增</a>
            <template>
              <Table border :columns="columns" :data="tableData"></Table>
            </template>
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
import modalForm from "@/components/formLink";

export default {
  name: "",
  components: {
    vHeader,
    vNav,
    vCrumbs
  },
  data() {
    return {
      crumbs: [
        {
          value: '友情链接',
          url: ''
        }
      ],
      name: "",
      columns: [
        {
          title: "友情链接名称",
          key: "LinkName",
          align: "center"
        },
        {
          title: "序号",
          key: "Sort",
          align: "center"
        },
        {
          title: "链接地址",
          key: "Url",
          align: "center"
        },
        {
          title: "状态",
          key: "StateString",
          align: "center"
        },
        {
          title: "创建时间",
          key: "CreateTime",
          width: 180,
          align: "center"
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
                    type: "primary",
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
                    'on-ok': () => {
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
      editData: {},
      addData: {},
      formData: {},
      formRef: "",
      loading: true
    };
  },
  mounted: function() {
    this.update();
  },
  methods: {
    remove: function(params) {
      let _this = this;
      this.axios
        .post(this.api.linkDelete, {
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
    stateValue: function(params) {
      if (params.row.State === 0) {
        return "启用";
      } else {
        if (params.row.State === 1) {
          return "停用";
        }
      }
    },
    states: function(params) {
      if (params.row.State === 1) {
        this.axios
          .post(this.api.linkState, {
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
            .post(this.api.linkState, {
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
    edit: function(params) {
      let _params = params;
      let _this = this;
      this.$Modal.confirm({
        loading: this.loading,
        render: h => {
          return h(modalForm, {
            props: {
              echoData: _params.row
            },
            on: {
              formData: data => {
                this.editData = data
                this.editData.ID = params.row.Id
              },
              formRef: data => {
                this.formRef = data
              }
            }
          });
        },
        onOk: function() {
          _this.formRef.validate(valid => {
            if (valid) {
              _this.axios.post(_this.api.linkEdit, _this.editData).then(res => {
                if (res.data.Success === true) {
                  _this.update();
                  _this.$Modal.remove();
                  _this.$Message.success("修改成功");
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
    page: function(index) {
      this.pageIndex = index;
      this.axios
        .get(this.api.linkList, {
          params: {
            page: index,
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
    update: function() {
      this.axios
        .get(this.api.linkList, {
          params: {
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
        render: (h, params) => {
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
              _this.axios.post(_this.api.linkAdd, _this.addData).then(res => {
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
    }
  }
};
</script>
<style scoped>
.search label {
  margin-right: 10px;
  margin-top: 10px;
  font-size: 14px;
}

.search input {
  width: 300px;
}

.search .btn {
  padding: 9px 25px;
  margin-left: 15px;
}
</style>
