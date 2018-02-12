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
                <label class="ivu-label">课程名称：</label>
                <input type="text" style="width:200px" class="ivu-input" v-model="name" placeholder="课程名称">
                <label class="ivu-label ml-20">状态：</label>
                <template>
                  <Select v-model="state" style="width:200px">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </template>
                <label class="ivu-label  ml-20">课程分类：</label>
                <template>
                  <Select style="width:200px" v-model="courseType">
                    <Option v-for="item in courseTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </template>
              </div>
              <div class="mt-20">
                <label class="ivu-label">课程类型：</label>
                <template>
                  <Select style="width:200px" v-model="firstCourseTypeID"  @on-change="courseChildData">
                    <Option v-for="item in firstCourseList" :value="item.ID" :key="item.ID">{{ item.CourseTypeName}}</Option>
                  </Select>
                </template>
                <template>
                  <Select style="width:200px" v-model="secondCourseTypeID" class="ml-20" v-show="course">
                    <Option v-for="item in secondCourseList" :value="item.ID" :key="item.ID">{{ item.CourseTypeName}}</Option>
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
import modalForm from "@/components/formExperience";

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
          value: "课程体验",
          url: ""
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
          title: "课程编码",
          align: "center",
          key: "Code"
        },
        {
          title: "课程名称",
          align: "center",
          key: "Name"
        },
        {
          title: "课程封面",
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
                  src: process.env.API_ROOT + params.row.ImgUrl,
                  style: "width: 50px; height: 50px;"
                }
              })
            ]);
          }
        },
        {
          title: "课程分类",
          align: "center",
          key: "CourseTypeChinese"
        },
        {
          title: "课程类型",
          align: "center",
          key: "CourseTypeName"
        },
        {
          title: "查看数",
          align: "center",
          key: "BrowseCount"
        },
        {
          title: "赞数",
          align: "center",
          key: "PraiseCount"
        },
        {
          title: "推荐设置",
          align: "center",
          key: "IsRecommendChinese"
        },
        {
          title: "序号",
          align: "center",
          key: "Sort"
        },
        {
          title: "状态",
          align: "center",
          key: "StateChinese"
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
          width: 200,
          render: (h, params) => {
            this.isShowButton()
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
                    this.btnDelete,
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
      name: "",
      firstCourseTypeID: "-1",
      secondCourseTypeID: "-1",
      firstCourseList: [],
      secondCourseList: [],
      courseType: "-1",
      course: false,
      formRef: "",
      modalWidth: "500px",
      loading: true,
      isDeleteShow: true,
      courseTypeList: [
        {
          value: "-1",
          label: "全部"
        },
        {
          value: "0",
          label: "通识课"
        },
        {
          value: "1",
          label: "专业课"
        }
      ]
    };
  },
  mounted: function() {
    this.update();
    this.courseData();
  },
  methods: {
    isShowButton: function () {
      if (this.isDeleteShow === true) {
        return this.btnDelete = 'Button'
      } else {
        return this.btnDelete = ''
      }
    },
    courseChildData: function(params) {
      if (params !== "" && params !== "-1") {
        this.axios
          .get(this.api.courseList, {
            params: {
              courseTypeName: "",
              state: "1",
              parentID: params
            }
          })
          .then(res => {
            if (res.data.Success === true) {
              if (res.data.Data.length === 0) {
                this.course = false;
              } else {
                this.secondCourseList = res.data.Data;
                this.secondCourseList.unshift({
                  CourseTypeName: "全部",
                  ID: "-1"
                });
                this.course = true;
              }
            }
          });
      }
    },
    courseData: function() {
      this.axios
        .get(this.api.courseList, {
          params: {
            courseTypeName: "",
            state: "1",
            parentID: "0"
          }
        })
        .then(res => {
          if (res.data.Success === true) {
            this.firstCourseList = res.data.Data;
            this.firstCourseList.unshift({ CourseTypeName: "全部", ID: "-1" });
          }
        });
    },
    search: function() {
      this.axios
        .get(this.api.courseExperienceList, {
          params: {
            name: this.name,
            courseType: this.courseType,
            firstCourseTypeID: this.firstCourseTypeID,
            secondCourseTypeID: this.secondCourseTypeID,
            state: this.state,
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
    update: function() {
      this.axios
        .get(this.api.courseExperienceList, {
          params: {
            name: this.name,
            courseType: "-1",
            firstCourseTypeID: "-1",
            secondCourseTypeID: "-1",
            state: this.state,
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          if (res.data.Success === true) {
            this.isDeleteShow = res.data.Data.IsShowDelete
            this.total = res.data.Data.Total
            this.tableData = res.data.Data.List
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
              _this.axios.post(_this.api.courseExperienceAdd, _this.formData).then(res => {
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
                .post(_this.api.courseExperienceEdit, _this.formData)
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
          .post(this.api.courseExperienceState, {
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
            .post(this.api.courseExperienceState, {
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
      this.axios
        .post(this.api.courseExperienceDelete, {
          id: params.row.ID
        })
        .then(res => {
          if (res.data.Success === true) {
            this.update();
          }
        });
    },
    page: function(index) {
      this.pageIndex = index;
      this.axios
        .get(this.api.courseExperienceList, {
          params: {
            name: '',
            courseType: "-1",
            firstCourseTypeID: "-1",
            secondCourseTypeID: "-1",
            state: '-1',
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
.search .btn {
  margin-left: 90px;
  margin-top: 20px;
}
</style>
