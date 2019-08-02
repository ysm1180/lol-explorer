import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/match/',
    },
    {
      path: '/match',
      name: 'match',
      component: () => import('./views/Match.vue'),
    },
    {
      path: '/match/:accountId',
      name: 'matchWithAccountId',
      component: () => import('./views/Match.vue'),
      props: true,
    },
    {
      path: '/rune',
      name: 'rune',
      component: () => import('./views/Rune.vue'),
    },
    {
      path: '/champselect',
      name: 'champ-select',
      component: () => import('./views/ChampSelect.vue'),
    },
    {
      path: '/champion/:championId',
      name: 'champion',
      component: () => import('./views/ChampionInfo.vue'),
    },
  ],
});
