import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ManageGuild from '../views/ManageGuild.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/:guildId',
    name: 'ManageGuild',
    component: ManageGuild,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
