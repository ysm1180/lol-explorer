import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const parsingId = (route: any) => ({ championId: Number(route.params.championId) });

export default new Router({
  mode: 'hash',
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
      path: '/gamepickban',
      name: 'game-pick-ban',
      component: () => import('./views/GamePickBan.vue'),
    },
    {
      path: '/champion/:championId',
      name: 'champion',
      component: () => import('./views/ChampionInfo.vue'),
      props: parsingId,
    },
    {
      path: '/dev',
      name: 'development',
      component: () => import('./views/Development.vue'),
    },
  ],
});
