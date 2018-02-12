import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import * as types from '@/store/types'
import Teacher from '@/page/teacher'
import Login from '@/page/login'
import DataDictionary from '@/page/dataDictionary'
import DataDictionaryManage from '@/page/dataDictionaryManage'
import Course from '@/page/course'
import CourseManage from '@/page/courseManage'
import Slider from '@/page/slider'
import CourseExperience from '@/page/courseExperience'
import Dynamic from '@/page/dynamic'
import Base from '@/page/base'
import Competition from '@/page/competition'
import Project from '@/page/project'
import FAQClassify from '@/page/faqClassify'
import FAQReclassify from '@/page/faqReclassify'
import FAQManage from '@/page/faqManage'
import Complain from '@/page/complain'
import Province from '@/page/province'
import Link from '@/page/link'
import WhereGo from '@/page/whereGo'
import Upload from '@/page/upload'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/upload',
      name: 'upload',
      component: Upload
    },
    {
      path: '/wherego',
      name: 'wherego',
      component: WhereGo
    },
    {
      path: '/province',
      name: 'province',
      component: Province
    },
    {
      path: '/link',
      name: 'link',
      component: Link
    },
    {
      path: '/complain',
      name: 'complain',
      component: Complain
    },
    {
      path: '/faqClassify',
      name: 'faqClassify',
      component: FAQClassify
    },
    {
      path: '/faqReclassify',
      name: 'faqReclassify',
      component: FAQReclassify
    },
    {
      path: '/faqManage',
      name: 'faqManage',
      component: FAQManage
    },
    {
      path: '/project',
      name: 'project',
      component: Project
    },
    {
      path: '/competition',
      name: 'competition',
      component: Competition
    },
    {
      path: '/base',
      name: 'base',
      component: Base
    },
    {
      path: '/dynamic',
      name: 'dynamic',
      component: Dynamic
    },
    {
      path: '/courseExperience',
      name: 'courseExperience',
      component: CourseExperience
    },
    {
      path: '/slider',
      name: 'slider',
      component: Slider
    },
    {
      path: '/courseManage',
      name: 'courseManage',
      component: CourseManage
    },
    {
      path: '/course',
      name: 'course',
      component: Course
    },
    {
      path: '/dataDictionaryManage',
      name: 'dataDictionaryManage',
      component: DataDictionaryManage
    },
    {
      path: '/dataDictionary',
      name: 'dataDictionary',
      component: DataDictionary,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: Teacher
    },
    {
      path: '/',
      name: 'login',
      component: Login
    }
  ]
})

if (localStorage.getItem('token')) {
    store.commit(types.LOGIN, localStorage.getItem('token'))
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.token) {
      next()
    } else {
      next({
        path: '/',
        query: {redirect: to.fullPath}
      })
    }
  } else {
     next()
  }
})

export default router
