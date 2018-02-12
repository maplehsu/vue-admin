<template>
  <div class="where">
    <a class="go" :href="PXURL">教培门户后台</a>
    <a class="go" @click="home">职教门户后台</a>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      PXURL: ''
    }
  },
  methods: {
    home: function () {
      this.axios.get(this.api.menu).then(res => {
        if (res.data.Success === true) {
          if (res.data.Data.length !== 0) {
            if (res.data.Data[0].ChildList != '') {
              localStorage.setItem('menu-active', res.data.Data[0].ChildList[0].URL)
              localStorage.setItem('menu-open', res.data.Data[0].URL)
              this.$router.push({name: res.data.Data[0].ChildList[0].URL})
            } else {
              localStorage.setItem('menu-active', res.data.Data[0].URL)
              this.$router.push({name: res.data.Data[0].URL})
            }
          } else {
            this.$Modal.info({
              title: '提示',
              content: '管理员没有给你分配菜单权限，请与管理员联系',
              okText: '关闭',
              cancelText: 'Cancel'
            })
          }
        }
      })
    }
  },
  mounted: function () {
    let go = JSON.parse(localStorage.getItem('menuList'))
    go.forEach(data => {
      if (data.FunctionItemCode === 'PX') {
        this.PXURL = data.URL
      }
    })
  }
}
</script>
<style scoped>
  .where {
    width: 360px;
    height: 410px;
    position: relative;
    left: 50%;
    top: 50%;
    margin-left: -180px;
    margin-top: -205px;
  }
  .go {
    display: inline-block;
    width: 360px;
    height: 60px;
    box-shadow: 0px 0px 20px rgba(43,96,242,0.2);
    background: rgba(43,96,242,1);
    color: #fff;
    font-size: 14px;
    line-height: 60px;
    text-align: center;
    margin-top: 50px;
    border-radius: 40px;
  }
</style>
