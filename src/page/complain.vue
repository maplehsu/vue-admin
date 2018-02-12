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
              <input type="text" class="ivu-input" v-model="name"  placeholder="标题、内容">
              <label class="ivu-label ml-20">反馈时间：</label>
              <template>
                <Row>
                  <Col span="11">
                    <DatePicker type="date" v-model="startTime" placeholder="开始时间"></DatePicker>
                  </Col>
                  <Col span="2" class="center" style="line-height: 36px;">至</Col>
                  <Col span="11">
                    <DatePicker type="date" v-model="endTime" placeholder="结束时间"></DatePicker>
                  </Col>
                </Row>
              </template>
              <a class="btn btn-default" @click="search">查询</a>
            </div>
          </div>
          <div class="panel-body">
            <a class="btn btn-primary mb-20" :href="this.api.complainExport+'?keyWord='+ name + '&createStartTime=' + startTime + '&createEndTime=' + endTime">导出</a>
            <template>
              <Poptip
                  confirm
                  title="您确认删除这条内容吗？"
                  @on-ok="removeList">
                  <Button class="btn btn-danger mb-20 ml-20">删除</Button>
              </Poptip>
            </template>
            <template>
              <Table  ref="table" highlight-row border :columns="columns" :data="tableData" @on-selection-change="multiple"></Table>
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
import modalForm from "@/components/formDynamic";

export default {
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
          value: "投诉建议",
          url: ""
        }
      ],
      state: -1,
      name: "",
      parentId: "0",
      tableName: "",
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "标题",
          key: "Title",
          align: "center"
        },
        {
          title: "联系类型",
          key: "ConcatTypeString",
          align: "center"
        },
        {
          title: "联系方式",
          key: "ConcatPattern",
          align: "center"
        },
        {
          title: "提建议人账号",
          key: "LoginName",
          align: "center"
        },
        {
          title: "提交时间",
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
                    size: "small"
                  },
                  class: "btn btn-primary",
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.select(params);
                    }
                  }
                },
                "查看"
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
      editName: "",
      createName: "",
      formData: {},
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      startTime: "",
      endTime: "",
      removeData: {}
    };
  },
  mounted: function() {
    this.update();
  },
  methods: {
    multiple: function(selection) {
      this.removeData = selection;
    },
    search: function() {
      this.axios
        .get(this.api.complainList, {
          params: {
            keyWord: this.name,
            createStartTime: this.startTime,
            createEndTime: this.endTime,
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
        .get(this.api.complainList, {
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
    select: function(params) {
      this.$Modal.info({
        title: "查看详情",
        content: `<ul class="select-info">
                      <li>提建议人账号：${params.row.LoginName}</li>
                      <li>标题：${params.row.Title}</li>
                      <li>联系类型：${params.row.ConcatTypeString}</li>
                      <li>联系方式：${params.row.ConcatPattern}</li>
                      <li>建议内容：${params.row.Content}</li>
                  </ul>`,
        okText: "关闭"
      });
    },
    remove: function(params) {
      this.axios
        .post(this.api.complainDelete, {
          Id: params.row.Id
        })
        .then(res => {
          if (res.data.Success === true) {
            this.update();
            this.$Message.success("删除成功");
          } else {
            this.$Message.error(res.data.Msg);
          }
        });
    },
    removeList: function() {
      if (!this.removeData.length) {
        this.$Message.error('你没有选择数据')
      } else {
        let id = "";
        this.removeData.forEach(data => {
          id += data.Id + ",";
        });
        this.axios
          .post(this.api.complainListDelete, {
            Ids: id
          }).then(res => {
            this.update()
          })
      }
    },
    page: function(index) {
      this.pageIndex = index;
      this.axios.get(this.api.complainList, {
        params: {
          name: '',
          state: -1,
          page: this.pageIndex,
          pageSize: this.pageSize
        }
      }).then(res => {
        if (res.data.Success === true) {
          this.total = res.data.Data.Total;
          this.tableData = res.data.Data.List;
        }
      })
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

.select-info {
  word-wrap:break-word;
}
</style>
