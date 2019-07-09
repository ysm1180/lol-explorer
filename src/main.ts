import Vue from 'vue';
import App from './App.vue';
import './plugins/vuetify';
import router from './router';
import store from './store/index';
import { Titlebar, Color } from 'custom-electron-titlebar';

const titlebar = new Titlebar({
  backgroundColor: Color.fromHex('#212121'),
  menu: null,
  shadow: true,
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
