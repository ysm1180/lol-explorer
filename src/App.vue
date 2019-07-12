<template>
  <div id="app">
    <!-- topbar -->
    <v-toolbar absolute id="top-bar" dark dense height="40" app>
      <v-layout fill-height align-center>
        <v-toolbar-side-icon @click="viewNav=!viewNav" />
        <v-flex class="white--text fill-height cursor-pointer" style="max-width:50px;" @click="$router.go(-1)">
          <v-btn small icon>
            <v-icon small>arrow_back_ios</v-icon>
          </v-btn>
        </v-flex>
        <v-flex class="white--text fill-height cursor-pointer" style="max-width:50px;" @click="$router.go(1)">
          <v-btn small icon>
            <v-icon small>arrow_forward_ios</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-toolbar>
    <!-- nav-bar -->
    <v-navigation-drawer class="grey darken-4" fixed temporary v-model="viewNav" height="100%" width="200px">
      <v-layout column fill-height pt-5>
        <v-divider />
        <v-flex
          class="menu" subheading cursor-pointer py-2
          @click="$router.push(`/match/${summoner.accountId}`)"
          :class="routerStartWith('/match')?'grey darken-3':''"
        >전적 확인</v-flex>
        <v-flex
          class="menu" subheading cursor-pointer py-2
          @click="$router.push('/rune')"
          :class="routerStartWith('/rune')?'grey darken-3':''"
        >룬 관리</v-flex>
        <v-divider />
      </v-layout>
    </v-navigation-drawer>
    <router-view style="padding-top:50px;" />
  </div>
</template>
<script>
import { IpcMessageEvent, ipcRenderer } from 'electron';

export default {
  name: 'App',
  components: {},
  data() {
    return {
      viewNav: true,
    };
  },
  computed: {
    lcuSummoner() {
      return this.$store.state.connection.lcuSummoner;
    },
    summoner() {
      return this.$store.state.connection.summoner;
    },
    status() {
      return this.$store.state.connection.status;
    },
  },
  mounted() {
    // f5
    document.addEventListener('keydown', (e) => {
      if (e.which === 123) {
        require('remote')
          .getCurrentWindow()
          .toggleDevTools();
      } else if (e.which === 116) {
        location.href = '/';
      }
    });
    // fetch statics
    this.$store.dispatch('lolstatic/fetchChampions');
    this.$store.dispatch('lolstatic/fetchSpells');
    this.$store.dispatch('lolstatic/fetchItems');
    this.$store.dispatch('lolstatic/fetchPerks');
    ipcRenderer.on('lcu-connect', async (event, lcuData) => {
      this.$store.commit('connection/setLcuData', lcuData);
      this.$store.commit('connection/setStatus', 'WAITING_LOGIN');
      await this.$store.dispatch('connection/loadLcuSummoner', lcuData);
      if (this.status === 'LOGIN_COMPLETE') {
        await this.$store.dispatch(
          'connection/updateSummoner',
          this.lcuSummoner.displayName
        );
        this.$router.push(`/match/${this.summoner.accountId}`);
      }
    });
    ipcRenderer.on('lcu-disconnect', () => {
      this.$store.dispatch('connection/initializeState');
      this.$store.dispatch('match/initializeState');
      this.$router.push('/');
    });
    ipcRenderer.on('lcu-api-message', async (event, data) => {
      // window.console.log(data);
      if (
        this.status !== 'LOGIN_COMPLETE' &&
        data.uri === '/lol-summoner/v1/current-summoner' &&
        data.data.displayName
      ) {
        await this.$store.commit('connection/setStatus', 'LOGIN_COMPLETE');
        await this.$store.commit('connection/setLcuSummoner', data.data);
        await this.$store.dispatch(
          'connection/updateSummoner',
          this.lcuSummoner.displayName
        );
        this.$router.push(`/match/${this.summoner.accountId}`);
      } else if (data.uri === '/lol-champ-select/v1/session' &&
        data.data.actions[0][0].championId !== 0
      ) {
        console.log(data);
        console.log(data.data.actions[0][0]);
        this.$router.push(`/rune/${data.data.actions[0][0].championId}`);
      }
    });
  },
  methods: {
    routerStartWith(url) {
      if (this.$router.currentRoute.path.indexOf(url) === 0) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style>
#app {
  width: 100vw;
  min-width: 800px;
  height: 100vh;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
}
.cursor-pointer {
  cursor: pointer;
}
.menu {
  max-height: 40px;
}
.cursor-pointer {
  cursor: pointer;
  width: 100%;
}
</style>
