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
              <label class="ivu-label">省份编号：</label>
              <input type="text" class="ivu-input" v-model="provinceCode" style="width:200px">
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
import vHeader from '@/components/header'
import vNav from '@/components/nav'
import vCrumbs from '@/components/crumbs'
import modalForm from '@/components/formProvince'

export default {
  name: '',
  components: {
    vHeader,
    vNav,
    vCrumbs
  },
  data () {
    return {
      crumbs: [
        {
          value: '项目省份',
          url: ''
        }
      ],
      columns: [
        {
          title: '序号',
          key: 'Sort',
          align: 'center'
        },
        {
          title: '项目省份',
          key: 'ProvinceName',
          align: 'center'
        },
        {
          title: '省份编号',
          key: 'ProvinceCode',
          align: 'center'
        },
        {
          title: '状态',
          key: 'StateString',
          align: 'center'
        },
        {
          title: '创建时间',
          width: 180,
          key: 'CreateTime',
          align: 'center'
        },
        {
          title: '操作',
          key: 'active',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                class: 'btn btn-primary',
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }, '编辑'),
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
            ])
          }
        }
      ],
      tableData: [],
      state: '-1',
      stateList: [
        {
          value: '-1',
          label: '全部'
        },
        {
          value: '1',
          label: '启用'
        },
        {
          value: '0',
          label: '停用'
        }
      ],
      provinceCode: '',
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      editData: {},
      addData: {},
      formRef: '',
      loading: true
    }
  },
  mounted: function () {
    this.update()
  },
  methods: {
    remove: function (params) {
      this.axios.post(this.api.provinceDelete, {
        'id': params.row.ID
      }).then(res => {
        if (res.data.Success === true) {
          this.update()
        } else {
          this.$Message.error(res.data.Msg)
        }
      })
    },
    stateValue: function (params) {
      if (params.row.State === 0) {
        return '启用'
      }else {
        if (params.row.State === 1) {
          return '停用'
        }
      }
    },
    states: function (params) {
      if (params.row.State === 1) {
        this.axios.post(this.api.provinceState, {
          'id': params.row.ID,
          'state': false
        }).then(res => {
          if (res.data.Success === true) {
            this.update()
          } else {
            this.$Message.error(res.data.Msg)
          }
        })
      }else {
        if (params.row.State === 0) {
          this.axios.post(this.api.provinceState, {
            'id': params.row.ID,
            'state': true
          }).then(res => {
            if (res.data.Success === true) {
              this.update()
            } else {
              this.$Message.error(res.data.Msg)
            }
          })
        }
      }
    },
    edit: function (params) {
      let _params = params
      let _this = this
      this.$Modal.confirm({
        loading: this.loading,
        width: this.modalWidth,
        render: (h) => {
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
        onOk: function () {
          _this.formRef.validate((valid) => {
            if(valid) {
              _this.axios.post(_this.api.provinceEdit, _this.editData).then(res => {
                if (res.data.Success === true) {
                  _this.update()
                  _this.$Modal.remove()
                  _this.$Message.info('修改成功')
                }
              })
            } else {
              this.$Message.info(res.data.Msg);
              this.buttonLoading = false
            }
          })
        }
      })
    },
    page: function (index) {
      this.pageIndex = index
      this.axios.get(this.api.provinceList, {
        params: {
          'state': '-1',
          'page': this.pageIndex,
          'pageSize': this.pageSize,
          'provinceCode': ''
        }
      }).then(res => {
        if (res.data.Success === true) {
          this.total = res.data.Data.Total
          this.tableData = res.data.Data.List
        }
      })
    },
    search: function () {
      this.axios.get(this.api.provinceList, {
        params: {
          'state': this.state,
          'page': this.pageIndex,
          'pageSize': this.pageSize,
          'provinceCode': this.provinceCode
        }
      }).then(res => {
        if (res.data.Success === true) {
          this.total = res.data.Data.Total
          this.tableData = res.data.Data.List
        }
      })
    },
    update: function () {
      this.axios.get(this.api.provinceList, {
        params: {
          'state': this.state,
          'page': this.pageIndex,
          'pageSize': this.pageSize,
          'provinceCode': this.provinceCode
        }
      }).then(res => {
        if (res.data.Success === true) {
          this.total = res.data.Data.Total
          this.tableData = res.data.Data.List
        } else {
          this.$Message.info(res.data.Msg)
        }
      })
    },
    add: function (params) {
      let _this = this
      this.$Modal.confirm({
        loading: this.loading,
        width: this.modalWidth,
        render: (h) => {
          return h(modalForm, {
            on: {
              formData: (data) => {
                this.addData = data
              },
               formRef: (data) => {
                this.formRef = data
              }
            }
          })
        },
         onOk: function () {
           _this.formRef.validate((valid) => {
            if(valid) {
              _this.axios.post(_this.api.provinceAdd, _this.addData).then(res => {
                if (res.data.Success === true) {
                  _this.update()
                  _this.$Modal.remove()
                  _this.$Message.info('添加成功')
                } else {
                  this.buttonLoading = false
                  _this.$Message.info(res.data.Msg)
                }
              })
            } else {
              this.buttonLoading = false
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.search label {
  margin-right: 10px;
  margin-top: 10px;
}

.search input {
  width: 300px;
}

.search .btn {
  padding: 9px 25px;
  margin-left: 15px;
}
</style>
