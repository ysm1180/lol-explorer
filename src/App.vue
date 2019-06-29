<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import { IpcMessageEvent, ipcRenderer } from 'electron';

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    lcuSummoner() {
      return this.$store.state.connection.lcuSummoner
    },
    summoner() {
      return this.$store.state.connection.summoner
    },
    status() {
      return this.$store.state.connection.status
    },
  },
  mounted () {
    // f5
    document.addEventListener("keydown", function (e) {
      if (e.which === 123) {
        require('remote').getCurrentWindow().toggleDevTools();
      } else if (e.which === 116) {
        location.href = '/'
      }
    });
    // fetch statics
    this.$store.dispatch('lolstatic/fetchChampions')
    this.$store.dispatch('lolstatic/fetchSpells')
    this.$store.dispatch('lolstatic/fetchItems')
    this.$store.dispatch('lolstatic/fetchPerks')
    ipcRenderer.on('lcu-connect', async (event, lcuData) => {
      this.$store.commit('connection/setLcuData', lcuData)
      this.$store.commit('connection/setStatus', 'WAITING_LOGIN')
      await this.$store.dispatch('connection/loadLcuSummoner', lcuData)
      if (this.status === 'LOGIN_COMPLETE') {
        await this.$store.dispatch('connection/updateSummoner', this.lcuSummoner.displayName)
      }
    })
    ipcRenderer.on('lcu-disconnect', () => {
      this.$store.dispatch('connection/initializeState')
      this.$store.dispatch('match/initializeState')
      this.$router.push('/')
    })
    ipcRenderer.on('lcu-api-message', async (event, data) => {
      window.console.log(data)
      if (this.status !== 'LOGIN_COMPLETE' &&
        data.uri === '/lol-summoner/v1/current-summoner' &&
        data.data.displayName
      ) {
        await this.$store.commit('connection/setStatus', 'LOGIN_COMPLETE')
        await this.$store.commit('connection/setLcuSummoner', data.data)
        await this.$store.dispatch('connection/updateSummoner', this.lcuSummoner.displayName)
      }
    })
  },
  methods: {
  }
}
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
