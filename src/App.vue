<template>
  <div id="app">
    <!-- topbar -->
    <div class="toolbar" id="top-bar">
      <div class="buttons">
        <button @click="$router.go(-1)" class="icon-button">
          <v-icon dark small>arrow_back_ios</v-icon>
        </button>
        <button @click="$router.go(1)" class="icon-button">
          <v-icon dark small>arrow_forward_ios</v-icon>
        </button>
      </div>
      <div class="buttons large">
        <button
          :class="isHome() && 'selected'"
          @click="enterHome()"
          class="icon-button"
          title="소환사 정보"
        >
          <v-icon dark>home</v-icon>
        </button>
        <button
          :class="isRunePage() && 'selected'"
          @click="enterRunePage()"
          class="icon-button"
          title="룬 관리"
        >
          <v-icon dark>filter_none</v-icon>
        </button>
        <button
          :class="isChampionSelectInGame() && 'selected'"
          @click="enterChampionSelectPage()"
          class="icon-button"
          title="In Game"
        >
          <v-icon dark>wifi</v-icon>
        </button>
      </div>
    </div>
    <router-view style="padding-top:50px;" />
  </div>
</template>
<script>
import { ipcRenderer } from 'electron';

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
      if (e.code === 'F5') {
        location.href = '/match';
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
      this.$router.push('/match/q');
    });
    ipcRenderer.on('lcu-api-message', async (event, data) => {
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
      } else if (
        data.uri === '/lol-champ-select/v1/session' &&
        data.data.actions[0][0].championId !== 0
      ) {
        this.$router.push(`/rune/${data.data.actions[0][0].championId}`);
      }
    });
  },
  methods: {
    isHome() {
      if (this.status === 'LOGIN_COMPLETE' && this.summoner) {
        const homeUrl = `/match/${this.summoner.accountId}`;
        return this.$router.currentRoute.path === homeUrl;
      } else {
      return this.routerStartWith('/match');
      }
    },

    isRunePage() {
      return this.routerStartWith('/rune');
    },

    isChampionSelectInGame() {
      return this.routerStartWith('/champselect');
    },

    enterHome() {
      let homeUrl;
      if (this.status === 'LOGIN_COMPLETE') {
        homeUrl = `/match/${this.summoner.accountId}`;
        if (this.$router.currentRoute.path !== homeUrl) {
          this.$router.push(homeUrl);
        }
      } else {
        homeUrl = `/match`;
      }

      if (this.$router.currentRoute.path !== homeUrl) {
        this.$router.push(homeUrl);
      }
    },

    enterRunePage() {
      const url = `/rune`;
      if (this.$router.currentRoute.path !== url) {
        this.$router.push(url);
      }
    },

    enterChampionSelectPage() {
      const url = `/champselect`;
      if (this.$router.currentRoute.path !== url) {
        this.$router.push(url);
      }
    },

    routerStartWith(...urls) {
      for (const url of urls) {
        if (this.$router.currentRoute.path.indexOf(url) === 0) {
          return true;
        }
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
}

.toolbar {
  display: flex;

  position: absolute;
  left: 0;
  top: 0;
  width: 100%;

  padding: 10px;
  margin-top: 0;
  text-align: left;

  background-color: #212121;
  color: white;

  z-index: 2;
}

.buttons {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}

.buttons.large > .icon-button {
  margin: 0 2px;
}

.icon-button {
  padding: 2px 5px;
  outline: 0;
}

.icon-button.selected {
  box-shadow: 0 0 0 2px darkorange;
  border-radius: 10px;
}
</style>
