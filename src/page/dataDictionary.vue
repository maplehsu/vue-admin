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
              <label class="ivu-label">字典名称：</label>
              <input type="text" class="ivu-input" v-model="name">
              <a class="btn btn-default" @click="search">查询</a>
            </div>
          </div>
          <div class="panel-body pb-50">
            <template>
              <Table border :columns="columns" :data="tableData"></Table>
            </template>
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
          value: '基础数据',
          url: ''
        },
        {
          value: '数据字典',
          url: ''
        }
      ],
      name: '',
      columns: [
        {
          title: '字典名称',
          key: 'DicName',
          align: 'center'
        },
        {
          title: '操作',
          key: 'active',
          align: 'center',
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
                    this.$router.push({name: 'dataDictionaryManage'})
                    localStorage.setItem('tableName', params.row.DicCode)
                  }
                }
              }, '管理')
            ])
          }
        }
      ],
      tableData: []
    }
  },
  mounted: function () {
    this.axios.get(this.api.dictionaryList, {
      params: {
        'DicName': this.name
      }
    }).then(res => {
      if (res.data.Success === true) {
        this.tableData = res.data.Data
      }
    })
  },
  methods: {
    search: function () {
      this.axios.get(this.api.dictionaryList, {
        params: {
          'DicName': this.name
        }
      }).then(res => {
        if (res.data.Success === true) {
          this.tableData = res.data.Data
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
