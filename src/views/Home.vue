<template>
  <v-container fill-height align-center pa-0>
    <v-layout v-if="status === 0" justify-center align-center>
      <v-flex display-1 font-weight-bold text-xs-center>롤 클라이언트를 실행해주세요</v-flex>
    </v-layout>
    <v-layout v-if="status === 1" justify-center align-center>
      <v-flex display-1 font-weight-bold text-xs-center>로그인을 기다리는중...</v-flex>
    </v-layout>
    <v-layout v-if="status === 2" align-center column>
      <!-- <v-flex display-1 font-weight-bold text-xs-center>로그인 이후 페이지</v-flex> -->
      <v-flex
        v-for="(match, key) in matches"
        v-bind:key="key"
      >
        <match-card :match="match"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { IpcMessageEvent, ipcRenderer } from 'electron';
import { lcuData } from 'models';
import { Component, Vue } from 'vue-property-decorator';
import MatchCard from '../components/MatchCard.vue';

@Component({
  components: {
    'match-card': MatchCard,
  },
})
export default class Home extends Vue {
  mounted(): void {
    ipcRenderer.on('lcu-connect', (event: IpcMessageEvent, lcuData: lcuData) => {
      this.$store.commit('connection/setLcuData', lcuData)
      this.$store.commit('connection/setStatus', 1)
    })
    ipcRenderer.on('lcu-disconnect', () => {
      this.$store.dispatch('connection/initializeState')
      this.$store.dispatch('match/initializeState')
    })
    ipcRenderer.on('lcu-api-message', async (event: IpcMessageEvent, data: any) => {
      if (this.status !== 2 &&
        data.uri === '/lol-summoner/v1/current-summoner' &&
        data.data.displayName
      ) {
        await this.$store.commit('connection/setStatus', 2)
        await this.$store.commit('connection/setLcuSummoner', data.data)
        await this.$store.dispatch('connection/updateSummoner', this.lcuSummoner.displayName)
        await this.$store.dispatch('match/updateMatches', this.summoner.accountId)
      }
    })
  }
  
  get status () {
    return this.$store.state.connection.status
  }
  get lcuData () {
    return this.$store.state.connection.lcuData
  }
  get lcuSummoner () {
    return this.$store.state.connection.lcuSummoner
  }
  get summoner () {
    return this.$store.state.connection.summoner
  }
  get matches () {
    return this.$store.state.match.matches
  }
}
</script>
