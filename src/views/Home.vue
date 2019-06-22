<template>
  <v-container fluid fill-height pa-0>
    <v-layout v-if="status === 'WAITING_CLIENT'" justify-center align-center>
      <v-flex display-1 font-weight-bold text-xs-center>롤 클라이언트를 실행해주세요</v-flex>
    </v-layout>
    <v-layout v-if="status === 'WAITING_LOGIN'" justify-center align-center>
      <v-flex display-1 font-weight-bold text-xs-center>로그인을 기다리는중...</v-flex>
    </v-layout>
    <v-layout v-if="status === 'LOGIN_COMPLETE'" justify-center align-center>
      <v-flex display-1 font-weight-bold text-xs-center @click="toMatchingInfo">전적확인</v-flex>
    </v-layout>
    <matching-info v-if="status === 'MATCHING_INFO'" />
  </v-container>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { IpcMessageEvent, ipcRenderer } from 'electron';
import { lcuData } from 'models';
import { Component, Vue } from 'vue-property-decorator';
import MatchingInfo from '../components/MatchingInfo/Index.vue';

@Component({
  components: {
    'matching-info': MatchingInfo,
  },
})
export default class Home extends Vue {
  toMatchingInfo() {
    this.$store.commit('connection/setStatus', 'MATCHING_INFO')
  }
  mounted(): void {
    this.$store.dispatch('lolstatic/fetchChampions')
    this.$store.dispatch('lolstatic/fetchSpells')
    this.$store.dispatch('lolstatic/fetchItems')
    ipcRenderer.on('lcu-connect', async (event: IpcMessageEvent, lcuData: lcuData) => {
      this.$store.commit('connection/setLcuData', lcuData)
      this.$store.commit('connection/setStatus', 'LOGIN_COMPLETE')
      await this.$store.dispatch('connection/loadLcuSummoner', lcuData)
      if (this.status === 'LOGIN_COMPLETE') {
        await this.$store.dispatch('connection/updateSummoner', this.lcuSummoner.displayName)
        // await this.$store.dispatch('match/updateMatches', this.summoner.accountId)
      }
    })
    ipcRenderer.on('lcu-disconnect', () => {
      this.$store.dispatch('connection/initializeState')
      this.$store.dispatch('match/initializeState')
    })
    ipcRenderer.on('lcu-api-message', async (event: IpcMessageEvent, data: any) => {
      window.console.log(data)
      if (this.status !== 'LOGIN_COMPLETE' &&
        data.uri === '/lol-summoner/v1/current-summoner' &&
        data.data.displayName
      ) {
        await this.$store.commit('connection/setStatus', 'LOGIN_COMPLETE')
        await this.$store.commit('connection/setLcuSummoner', data.data)
        await this.$store.dispatch('connection/updateSummoner', this.lcuSummoner.displayName)
        // await this.$store.dispatch('match/updateMatches', this.summoner.accountId)
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
