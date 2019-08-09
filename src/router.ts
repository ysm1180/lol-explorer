import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const parsingId = (route: any) => ({ championId: Number(route.params.championId) })

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
<<<<<<< HEAD
    // {
    //   path: '/champion/:championId',
    //   name: 'champion',
    //   component: () => import('./views/ChampionInfo.vue'),
    // },
=======
    {
      path: '/champion/:championId',
      name: 'champion',
      component: () => import('./views/ChampionInfo.vue'),
      props: parsingId,
    },
>>>>>>> 77f69a8a899231deee087021b021dd0ee383db4d
  ],
});
