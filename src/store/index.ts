import Vue from 'vue';
import Vuex from 'vuex';
import connection from './modules/connection/index';
import lolstatic from './modules/lolstatic/index';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    connection,
    lolstatic,
  },
});
