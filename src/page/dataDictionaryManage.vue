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
              <label class="ivu-label">数据名称：</label>
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
          <div class="panel-body pb-50">
            <a class="btn btn-primary mb-20" @click="add">新增</a>
            <router-link :to="{path: 'dataDictionary'}"><a class="btn btn-default mb-20 ml-20">返回</a></router-link>
            <template><Table border :columns="columns" :data="tableData"></Table></template>
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
import modalForm from "@/components/formName";

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
          value: "基础数据",
          url: ""
        },
        {
          value: "数据字典",
          url: "dataDictionary"
        },
        {
          value: "数据字典管理",
          url: ""
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
      tableName: "",
      columns: [
        {
          title: "数据名称",
          key: "DicName",
          align: "center"
        },
        {
          title: "状态",
          key: "StateString",
          align: "center"
        },
        {
          title: "操作",
          key: "active",
          align: "center",
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
      code: "",
      editData: "",
      loading: true,
      formRef: "",
      addData: ""
    };
  },
  mounted: function() {
    this.code = localStorage.getItem("tableName");
    this.update();
  },
  methods: {
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
        .get(this.api.dictionaryManage, {
          params: {
            tableName: this.code,
            dicName: this.name,
            State: "-1"
          }
        })
        .then(res => {
          if (res.data.Success === true) {
            this.tableData = res.data.Data;
          }
        });
    },
    search: function() {
      this.axios
        .get(this.api.dictionaryManage, {
          params: {
            tableName: this.code,
            dicName: this.name,
            State: this.state
          }
        })
        .then(res => {
          if (res.data.Success === true) {
            this.tableData = res.data.Data;
          }
        });
    },
    add: function() {
      let _this = this;
      this.$Modal.confirm({
        loading: this.loading,
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
          })
        },
        onOk: function() {
          _this.formRef.validate(valid => {
            if (valid) {
              _this.addData.tableName = _this.code
              _this.axios.post(_this.api.dictionaryAdd, _this.addData).then(res => {
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
          })
        }
      });
    },
    edit: function(params) {
      let _this = this
      let _params = params
      this.$Modal.confirm({
        loading: this.loading,
        render: h => {
          return h(modalForm, {
            props: {
              echoData: _params.row
            },
            on: {
              formData: (data) => {
                this.editData = data
              },
              formRef: (data) => {
                this.formRef = data
              }
            }
          })
        },
        onOk: function() {
          _this.formRef.validate((valid) => {
            if(valid) {
              _this.editData.tableName = _this.code
              _this.axios.post(_this.api.dictionaryEdit, _this.editData).then(res => {
                if (res.data.Success === true) {
                  _this.update()
                  _this.$Modal.remove()
                  _this.$Message.info('修改成功')
                } else{
                  this.$Message.info(res.data.Msg);
                  this.buttonLoading = false;
                }
              })
            } else {
              this.buttonLoading = false
            }
          })
        }
      });
    },
    states: function(params) {
      if (params.row.State === 1) {
        this.axios
          .post(this.api.dictionaryState, {
            tableName: this.code,
            dicID: params.row.DicID,
            State: false
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
            .post(this.api.dictionaryState, {
              tableName: this.code,
              dicID: params.row.DicID,
              State: true
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
      this.axios
        .post(this.api.dictionaryDelete, {
          tableName: this.code,
          dicID: params.row.DicID
        })
        .then(res => {
          if (res.data.Success === true) {
            this.update();
            this.$Message.success("删除成功");
          } else {
            this.$Message.error(res.data.Msg);
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
