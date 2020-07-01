import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from '../pages/recommend/recommend'
import Singer from '../pages/singer/singer'
import Rank from '../pages/rank/rank'
import Search from '../pages/search/search'
import SingerDetail from '../pages/singer-detall/singer-detall'
import Disc from '../pages/disc/disc'
import TopList from '../pages/top-list/top-list'
import UserCenter from '../pages/user-center/user-center'
Vue.use(VueRouter)
export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/recommend',
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
