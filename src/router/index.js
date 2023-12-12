import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import room from '../components/room.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path:'/room',
    name: 'room',
    component: room
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
