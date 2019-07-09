<template>
  <v-layout fill-height column align-center id="match-page" @scroll="onScroll">
    <v-flex id="summoner-info" ma-5>
      <summoner-info-card
        v-if="summoner!==null"
        :summoner="summoner"
        :renewing="renewing"
        @renew="renew"
      />
      <v-layout fill-height justify-center align-center>
        <v-progress-circular v-if="loadingSummoner" indeterminate color="grey" />
      </v-layout>
    </v-flex>
    <v-tabs fixed-tabs dark height=40 slider-color="blue" v-model="tab" class="mb-1 grey darken-4">
      <v-tab class="cursor-pointer">전적</v-tab>
      <v-tab class="cursor-pointer">챔피언 분석</v-tab>
    </v-tabs>
    <v-layout style="min-width:600px;width:100%;" justify-center>
      <v-flex xs12 sm10 md8 lg6 xl6>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-layout column fill-height>
              <v-flex v-for="(match, index) in matches" v-bind:key="index" mb-2>
                <div class="match-card-wrap" @click="toggle(index)" style="cursor:pointer">
                  <match-card :match="match" />
                </div>
                <div class="match-detail-wrap" v-if="toggleArray.includes(index)">
                  <match-detail :match="match" />
                </div>
              </v-flex>
              <v-flex text-xs-center>
                <v-progress-circular v-if="loadingMatches" indeterminate color="grey" />
              </v-flex>
            </v-layout>
          </v-tab-item>
          <v-tab-item>
            <champion-info-card v-if="champions!==null" :champions="champions" />
            <v-layout fill-height justify-center align-center>
              <v-progress-circular v-if="loadingChampion" indeterminate color="grey" />
            </v-layout>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';
import { Component, Vue, Prop, Watch, PropSync } from 'vue-property-decorator';
import axios from 'axios';
import SummonerInfoCard from '../components/Match/SummonerInfoCard.vue';
import ChampionInfoCard from '../components/Match/ChampionInfoCard.vue';
import MatchCard from '../components/Match/MatchCard.vue';
import MatchDetail from '../components/Match/MatchDetail.vue';

const ENDPOINT = 'http://localhost:3000';

@Component({
  components: {
    'match-card': MatchCard,
    'champion-info-card': ChampionInfoCard,
    'match-detail': MatchDetail,
    'summoner-info-card': SummonerInfoCard,
  },
})
export default class Index extends Vue {
  @Prop() public accountId!: string;
  public summoner: any = null;
  public page: number = 0;
  public toggleArray: number[] = [];
  public renewing: boolean = false;
  public loadingSummoner: boolean = true;
  public loadingChampion: boolean = true;
  public loadingMatches: boolean = true;
  public tab: number = 0;

  @Watch('$route')
  public onRouteChanged(to: any, from: any) {
    this.summoner = null;
    this.toggleArray = [];
    this.$store.commit('match/initialize');
    this.loadingSummoner = true;
    this.loadingMatches = true;
    this.loadingChampion = true;
    this.init();
  }

  public async mounted() {
    this.init();
  }

  public async init() {
    const response = await axios.get(`${ENDPOINT}/summoner/byAccount/${this.accountId}`);
    this.summoner = response.data;
    this.loadingSummoner = false;
    await this.$store.dispatch('match/updateMatches', { accountId: this.accountId, page: this.page });
    this.loadingMatches = false;
    await this.$store.dispatch('match/fetchChampions', { seasonId: 13, accountId: this.accountId });
    this.loadingChampion = false;
  }

  get matches() {
    return this.$store.state.match.matches;
  }
  get champions() {
    return this.$store.state.match.champions;
  }

  public async renew() {
    this.renewing = true;
    try {
      await axios.post(`${ENDPOINT}/summoner/${this.summoner.name}`);
      this.page = 0;
      const response = await axios.get(
        `${ENDPOINT}/summoner/byAccount/${this.accountId}`
      );
      this.summoner = response.data;
      await this.$store.dispatch('match/updateMatches', {
        accountId: this.accountId,
        page: this.page,
      });
      await this.$store.dispatch('match/fetchChampions', {
        accountId: this.accountId,
        seasonId: 13,
      });
    } catch (err) {
      alert(`${err.response.data.seconds}초 후에 시도해주세요`);
    }
    this.renewing = false;
  }
  public toggle(index: number) {
    if (this.toggleArray.includes(index)) {
      const idx = this.toggleArray.indexOf(index);
      this.toggleArray.splice(idx, 1);
    } else {
      this.toggleArray.push(index);
    }
  }
  public async onScroll({ target }: any) {
    const { scrollTop, clientHeight, scrollHeight } = target;
    if (scrollTop + clientHeight >= scrollHeight && this.tab === 0) {
      this.loadingMatches = true;
      this.page += 1;
      await this.$store.dispatch('match/updateMatches', {
        accountId: this.accountId,
        page: this.page,
      });
      this.loadingMatches = false;
    }
  }
}
</script>
<style scoped>
#match-page {
  overflow-y: auto;
}
#summoner-info {
  width: 70%;
  min-height: 100px;
  max-height: 100px;
  max-width: 750px;
  min-width: 600px;
}
#champion-info {
  width: 70%;
  max-width: 750px;
  min-width: 600px;
}
#match-info {
  width: 70%;
  max-width: 750px;
  min-width: 600px;
}
.match-card-wrap {
  width: 100%;
  height: 50px;
}
</style>
