<template>
  <div class="home">
  </div>
</template>

<script lang="ts">
import { IpcMessageEvent, ipcRenderer } from 'electron';
import { ILCUData } from 'models';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Home extends Vue {
  mounted() {
    ipcRenderer.on('lcu-connect', (event: IpcMessageEvent, lcuData: ILCUData) => {
      this.$store.commit('setIlcuData', lcuData)
    })
    ipcRenderer.on('lcu-disconnect', () => {
      this.$store.commit('setIlcuData', null)
    })
    ipcRenderer.on('lcu-api-message', (event: IpcMessageEvent, data: any) => {
      console.log(data)
      if (data.uri === '/lol-summoner/v1/current-summoner') {
        this.$store.commit('setCurrentSummoner', data.data)
      }
    })
  }
}
</script>
