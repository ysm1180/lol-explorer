import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  getters: {
    ilcuData: state => { return state.ilcuData },
    currentSummoner: state => { return state.currentSummoner },
  },
  state: {
    ilcuData: null,
    currentSummoner: null,
  },
  mutations: {
    setIlcuData (state, ilcuData) {
      state.ilcuData = ilcuData
    },
    setCurrentSummoner (state, data) {
      state.currentSummoner = data
    },
  },
  actions: {
  },
});
