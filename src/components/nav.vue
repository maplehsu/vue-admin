<template>
  <nav class="nav">
    <div>
      <div class="user">
        <div class="photo" v-if="show"><img src="../assets/img/u.jpg"></div>
        <div class="photo" v-else><img :src="photo"></div>
        <ul class="info">
          <li>{{name}}</li>
          <li>{{post}}</li>
        </ul>
        <a class="tools">
          <Icon type="navicon"></Icon>
        </a>
      </div>
      <Menu ref="menu" width="210px" @on-select="menuRouter" @on-open-change="open" :active-name="active" :open-names="openName">
        <MenuItem  v-for="item in menuList"  v-if="item.ChildList.length === 0" :name="item.URL">
          <Icon :type="item.FunClass"></Icon>{{item.FunctionItemName}}
        </MenuItem>
        <Submenu v-else :name="item.URL">
          <template slot="title">
            <Icon :type="item.FunClass"></Icon>{{item.FunctionItemName}}
          </template>
          <MenuItem v-for="itemChild in item.ChildList" :name="itemChild.URL">
            {{itemChild.FunctionItemName}}{{itemChild.URl}}
          </MenuItem>
        </Submenu>
      </Menu>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'v-nav',
  data: function () {
    return {
      active: '',
      openName: [],
      menuList: [],
      name: '',
      post: '',
      photo: '',
      show: true
    }
  },
  created: function () {
    let user = JSON.parse(localStorage.getItem('userInfo'))
    this.name = user.RealName
    this.post = user.RoleName
    if (user.UserLogo === '') {
      this.show = true
    } else {
      this.show = false
      this.photo = process.env.API_IMG + user.UserLogo
    }
  },
  mounted: function () {
    setTimeout(() => {
      this.axios.get(this.api.menu).then(res => {
        if (res.data.Success === true) {
          this.menuList = res.data.Data
          this.update()
        }
      })
    }, 100)
  },
  methods: {
    menuRouter: function (name) {
      localStorage.setItem('menu-active', name)
      this.$router.push({name})
    },
    open: function (name) {
      localStorage.setItem('menu-open', name)
    },
    update: function () {
      this.active = localStorage.getItem('menu-active')
      this.openName = localStorage.getItem('menu-open').split(',')
      this.$nextTick(() => {
        this.$refs.menu.updateActiveName()
        this.$refs.menu.updateOpened()
      })
    }
  }
}
</script>
<style scoped>
.nav {
  width: 210px;
  height: 100%;
  background: #fff;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.1);
  flex-shrink: 0;
  position: relative;
}

.nav > div {
  position: fixed;
  z-index: 101;
  height: 100%;
}

.user {
  width: 210px;
  height: 60px;
  background: rgba(43, 96, 242, 1);
  padding: 0px 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}

.photo {
  width: 36px;
  height: 36px;
  overflow: hidden;
}

.photo img {
  width: 100%;
  border-radius: 50%;
}

.info {
  margin-left: 10px;
  font-size: 12px;
  color: rgba(233, 233, 233, 1);
}

.tools {
  position: absolute;
  right: 15px;
}

.ivu-icon-navicon {
  color: rgba(255, 255, 255, 1);
  font-size: 24px;
}

.ivu-menu {
  padding-top: 20px;
}

.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  border: 0;
}

.ivu-menu-item > i {
  margin-right: 10px;
}
</style>
