import Vue from 'vue';
import Vuex from 'vuex';
import connection from './modules/connection/index';
import match from './modules/match/index';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    connection,
    match,
  }
})