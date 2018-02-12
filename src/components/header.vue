<template>
  <header>
    <div class="header-nav">
      <div class="logo">职教师资管理后台</div>
      <div class="item">
        <ul>
          <li>
            <a v-show="show" href="http://www.ourteacher.com.cn/Manage/SystemManager"><Icon type="arrow-swap"></Icon>切换到教师教育</a>
          </li>
          <li @click="end"><router-link :to="{path: '/'}"><Icon type="log-out"></Icon>退出</router-link></li>
        </ul>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  name: 'v-header',
  data: function () {
    return {
      show: true
    }
  },
  methods: {
    end: function () {
      this.G.clearCookie('token')
      localStorage.clear()
    }
  },
  mounted: function () {
    this.axios.get(this.api.jurisdictionLink, {
    }).then(res => {
      if (res.data.Success === true) {
        this.show = true
      } else {
        this.show = false
      }
    })
  }
}
</script>
<style scoped>
header {
  height: 60px;
  background: rgba(100, 141, 255, 1);
  width: 100%;
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 20px;
}

.logo {
  font-size: 22px;
  color: #fff;
}

.item ul li {
  float: left;
  margin-left: 30px;
}

.item ul li i {
  margin-right: 5px;
}

.item ul li > a {
  color: #fff;
  font-size: 14px;
}
</style>
