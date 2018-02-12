<template>
  <div class="login between">
    <h1 class="logo"></h1>
    <div class="form">
      <div class="form-group">
        <label>用户名</label>
        <Input style="width: 210px" v-model="userName"></Input>
      </div>
      <div class="form-group">
        <label>密码</label>
        <template>
          <Input style="width: 210px" v-model="password" type="password" @on-enter="login"></Input>
        </template>
      </div>
      <div class="form-group between">
        <a class="btn btn-primary" @click="login">登录</a>
      </div>
    </div>
    <img src="../assets/img/banner.png" class="banner">
  </div>
</template>
<script>
import * as types from '@/store/types'
import $ from '@/assets/js/jquery-1.12.4.min.js'
export default {
  name: 'login',
  data: function data () {
    return {
      userName: '',
      password: ''
    }
  },
  created: function () {
    let token = this.G.getCookie('token')
    if (token !== null) {
      this.axios.get(this.api.loginToken, {
        params: {
          'token': token
        }
      }).then(res => {
        if (res.data.Success === true) {
          this.$store.commit(types.LOGIN, res.data.Data.Token)
          localStorage.setItem('userInfo', JSON.stringify(res.data.Data))
          if(res.data.Data.RoleNature == 1){
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
          } else {
            this.$Modal.info({
              title: '提示',
              content: '您不是后台角色，不能在此登录',
              okText: '关闭',
              cancelText: 'Cancel'
            })
          }
        } else {
          this.$Message.info(res.data.Msg)
        }
      })
    }
  },
  methods: {
    login: function () {
      this.$Loading.start()
      let _this = this
      $.ajax({
        type: "GET",
        url: this.api.login,
        data: { loginName: this.userName, loginPwd: this.password},
        dataType: "jsonp",
        jsonp: "callback",
        success: (res) => {
          if (res.Success === true) {
            this.$Loading.finish()
            if(res.Data.RoleNature == 1){
                this.$store.commit(types.LOGIN, res.Data.Token)
                localStorage.setItem('userInfo', JSON.stringify(res.Data))
                this.axios.get(this.api.menuList).then(resChild => {
                  localStorage.setItem('menuList', JSON.stringify(resChild.data.Data))
                  this.$router.push({name: 'wherego'})
                })
                $.ajax({
                  type: "GET",
                  url: this.api.loginPX,
                  data: { userName: this.userName, passWord: this.password,  validCode: "" },
                  dataType: "jsonp",
                  jsonp: "callback"
                })
            } else {
              this.$Modal.info({
                title: '提示',
                content: '您不是后台角色，不能在此登录',
                okText: '关闭',
                cancelText: 'Cancel'
              })
            }
          } else {
            this.$Message.info(res.Msg)
          }
        }
      })
    }
  }
}
</script>
<style scoped>
  .form {
    width: 210px;
  }

  .login {
    width: 700px;
    height: 410px;
    background: #fff;
    position: relative;
    left: 50%;
    top: 50%;
    margin-left: -350px;
    margin-top: -205px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    padding: 100px 70px;
  }

  label {
    display: block;
    margin-bottom: 10px;
    color: rgba(74,74,74,1);
  }

  .btn {
    margin-top: 13px;
  }

  .forget-password {
    margin-top: 20px;
    color: rgba(255,109,71,1);
  }

  .banner {
    width: 300px;
    height: 135px;
    margin-top: 30px;
  }

  .logo {
    width: 50px;
    height: 30px;
    background: url(../assets/img/logo.png) no-repeat;
    background-size: 100%;
    position: absolute;
    left: 20px;
    top: 20px;
  }

</style>
