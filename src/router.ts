import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Home.vue'),
    },
    {
      path: '/match/:accountId',
      name: 'match',
      component: () => import('./views/Match.vue'),
      props: true,
    },
    {
      path: '/rune',
      name: 'rune',
      component: () => import('./views/Rune.vue'),
    },
    {
      path: '/rune/:championId',
      name: 'rune-detail',
      component: () => import('./views/RuneDetail.vue'),
      props: true,
    },
    {
      path: '/champselect',
      name: 'champ-select',
      component: () => import('./views/ChampSelect.vue'),
    },
  ],
});
