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
              <label class="ivu-label">关键字：</label>
              <input type="text" class="ivu-input" v-model="name" placeholder="标题、发布者">
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
import vHeader from '@/components/header'
import vNav from '@/components/nav'
import vCrumbs from '@/components/crumbs'
import modalForm from '@/components/formDynamic'

export default {
  name: '',
  components: {
    vHeader,
    vNav,
    vCrumbs,
    modalForm
  },
  data () {
    return {
      crumbs: [
        {
          value: '最新动态',
          url: ''
        }
      ],
      modalWidth: "800px",
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
      name: '',
      parentId: '0',
      tableName: '',
      columns: [
        {
          title: '封面图',
          key: 'ImgUrl',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Img', {
                props: {
                  size: 'small'
                },
                attrs: {
                  src: process.env.API_IMG + params.row.ImgUrl,
                  style: 'width: 50px; height: 50px;'
                }
              }),
            ])
          }
        },
        {
          title: '标题',
          key: 'Title',
          align: 'center'
        },
        {
          title: '置顶设置',
          key: 'RecommendType',
          align: 'center'
        },
        {
          title: '状态',
          key: 'StateType',
          align: 'center'
        },
        {
          title: '查看数',
          key: 'BrowseCount',
          align: 'center'
        },
        {
          title: '赞数',
          key: 'PraiseCount',
          align: 'center'
        },
        {
          title: '发布者',
          key: 'RealName',
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
          width: 300,
          render: (h, params) => {
            this.isShowButton()
            return h('div', [
              h('Button', {
                props: {
                  size: 'small'
                },
                class: 'btn btn-primary',
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  size: 'small'
                },
                style: {
                  marginLeft: '10px'
                },
                class: 'btn btn-primary',
                on: {
                  click: () => {
                    this.stick(params)
                  }
                }
              }, this.stickValue(params)),
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
      code: '',
      editName: '',
      createName: '',
      formData: {},
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      formRef: '',
      loading: true,
      btnDelete: '',
      isDeleteShow: true
    }
  },
  mounted: function () {
    this.update()
  },
  methods: {
    isShowButton: function () {
      if (this.isDeleteShow === true) {
        return this.btnDelete = 'Button'
      } else {
        return this.btnDelete = ''
      }
    },
    stick: function (params) {
      if (params.row.RecommendType === '置顶') {
        this.$Modal.confirm({
          title: '确认提示',
          content: '您确认取消这条置顶吗？',
          onOk: () => {
            this.axios.post(this.api.dynamicStick, {
              'id': params.row.ID,
              'recommendState': 0
            }).then(res => {
              if (res.data.Success === true) {
                this.update()
              }
            })
          }
        })
      } else {
        if (params.row.RecommendType === '不置顶') {
          this.$Modal.confirm({
            title: '确认提示',
            content: '您确认要置顶这条数据吗？',
            onOk: () => {
              this.axios.post(this.api.dynamicStick, {
                'id': params.row.ID,
                'recommendState': 1
              }).then(res => {
                if (res.data.Success === true) {
                  this.update()
                }
              })
            }
          })
        }
      }
    },
    search: function () {
      this.axios.get(this.api.dynamicList, {
        params: {
          'name': this.name,
          'state': this.state,
          'page': this.pageIndex,
          'pageSize': this.pageSize,
        }
      }).then(res => {
        if (res.data.Success === true) {
          this.total = res.data.Data.Total
          this.tableData = res.data.Data.List
        }
      })
    },
    stickValue: function (params) {
      if (params.row.RecommendType === '置顶') {
        return '取消置顶'
      }else {
        if (params.row.RecommendType === '不置顶') {
          return '启用置顶'
        }
      }
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
    update: function () {
      this.axios.get(this.api.dynamicList, {
        params: {
          'name': this.name,
          'state': this.state,
          'page': this.pageIndex,
          'pageSize': this.pageSize,
        }
      }).then(res => {
        if (res.data.Success === true) {
          this.isDeleteShow = res.data.Data.IsShowDelete
          this.total = res.data.Data.Total
          this.tableData = res.data.Data.List
        }
      })
    },
    add: function () {
      let _this = this
      this.$Modal.confirm({
        width: this.modalWidth,
        loading: this.loading,
        render: (h, params) => {
          return h(modalForm, {
            on: {
              formData: (data) => {
                this.formData = data
              },
              formRef: (data) => {
                this.formRef = data
              }
            }
          })
        },
        onOk: function () {
          console.log(_this.formData);
          _this.formRef.validate((valid) => {
            if(valid) {
              _this.axios.post(_this.api.dynamicAdd, _this.formData).then(res => {
                if (res.data.Success === true) {
                  _this.update()
                  _this.$Modal.remove()
                  _this.$Message.info('添加成功')
                }else{
                  this.$Message.info(res.data.Msg)
                  this.buttonLoading = false;
                }
              })
            } else {
              this.buttonLoading = false
            }
          })
        }
      })
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
              isEdit: true,
              echoData: _params.row
            },
            on: {
              formData: (data) => {
                this.formData = data
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
              _this.formData.ID = params.row.ID
              _this.axios.post(_this.api.dynamicEdit, _this.formData).then(res => {
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
      })
    },
    states: function (params) {
      if (params.row.State === 1) {
        this.axios.post(this.api.dynamicState, {
          'id': params.row.ID,
          'state': false
        }).then(res => {
          if (res.data.Success === true) {
            this.update()
          } else {
            this.$Message.info(res.data.Msg)
          }
        })
      }else {
        if (params.row.State === 0) {
          this.axios.post(this.api.dynamicState, {
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
    remove: function (params) {
      this.axios.post(this.api.dynamicDelete, {
        'id': params.row.ID
      }).then(res => {
        if (res.data.Success === true) {
          this.update()
        }
      })
    },
    page: function (index) {
      this.pageIndex = index
      this.axios.get(this.api.dynamicList, {
        params: {
          'name': '',
          'state': -1,
          'page': this.pageIndex,
          'pageSize': this.pageSize,
        }
      }).then(res => {
        this.total = res.data.Data.Total
        this.tableData = res.data.Data.List
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
  width: 200px;
}

.search .btn {
  padding: 9px 25px;
  margin-left: 15px;
}
</style>
