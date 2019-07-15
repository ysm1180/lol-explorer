<template>

  <v-layout align-center justify-center fill-height>
    <v-layout v-if="status !== 'LOGIN_COMPLETE'" align-center justify-center fill-height>
      <span v-if="status === 'WAITING_CLIENT'" class="display-1 font-weight-bold">롤 클라이언트를 실행해주세요</span>
      <span v-if="status === 'WAITING_LOGIN'" class="display-1 font-weight-bold">로그인을 기다리는 중...</span>
    </v-layout>

    <v-layout fill-height column align-center id="match-page" @scroll="onScroll"
              v-if="status === 'LOGIN_COMPLETE'">
      <v-flex id="summoner-info" ma-5>
        <summoner-info-card
          v-if="summoner!==null"
          :summoner="summoner"
          :renewing="renewing"
          @renew="renew"
        />
        <v-layout fill-height justify-center align-center>
          <v-progress-circular v-if="loadingSummoner" indeterminate color="grey"/>
        </v-layout>
      </v-flex>
      <v-tabs fixed-tabs dark color="transparent" height=40 slider-color="orange" v-model="tab" class="mb-1">
        <v-tab class="cursor-pointer">전적</v-tab>
        <v-tab class="cursor-pointer">챔피언 분석</v-tab>
      </v-tabs>

      <v-layout style="min-width:600px;width:700px;">
        <v-flex>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-layout column fill-height>
                <v-flex v-for="(match, index) in matches" v-bind:key="index" mb-2>
                  <div class="match-card-wrap" @click="toggle(index)" style="cursor:pointer">
                    <match-card :match="match"/>
                  </div>
                  <div class="match-detail-wrap" v-if="toggleArray.includes(index)">
                    <match-detail :match="match"/>
                  </div>
                </v-flex>
                <v-layout fill-height justify-center align-center>
                  <v-icon class="cursor-none" v-if="!loadingMatches">arrow_drop_down_circle</v-icon>
                </v-layout>
                <v-flex text-xs-center>
                  <v-progress-circular v-if="loadingMatches" indeterminate color="grey"/>
                </v-flex>
              </v-layout>
            </v-tab-item>
            <v-tab-item>
              <champion-info-card v-if="champions!==null" :champions="champions"/>
              <v-layout fill-height justify-center align-center>
                <v-progress-circular v-if="loadingChampion" indeterminate color="grey"/>
              </v-layout>
            </v-tab-item>
          </v-tabs-items>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
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
    @Prop() private accountId!: string;
    private summoner: any = null;
    private page: number = 0;
    private toggleArray: number[] = [];
    private renewing: boolean = false;
    private loadingSummoner: boolean = true;
    private loadingChampion: boolean = true;
    private loadingMatches: boolean = true;
    private tab: number = 0;
    private prevScrollEnd: boolean = false;

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
      if (this.accountId) {
        const response = await axios.get(`${ENDPOINT}/summoner/byAccount/${this.accountId}`);
        this.summoner = response.data;
        this.loadingSummoner = false;
        await this.$store.dispatch('match/updateMatches', {accountId: this.accountId, page: this.page});
        this.loadingMatches = false;
        await this.$store.dispatch('match/fetchChampions', {seasonId: 13, accountId: this.accountId});
        this.loadingChampion = false;
      }
    }

    get status() {
      return this.$store.state.connection.status;
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

    public async onScroll({target}: any) {
      const {scrollTop, clientHeight, scrollHeight} = target;

      if (
        this.tab === 0 &&
        !this.loadingMatches &&
        this.prevScrollEnd &&
        scrollTop + clientHeight >= scrollHeight
      ) {
        this.loadingMatches = true;
        this.prevScrollEnd = false;
        this.page += 1;
        await this.$store.dispatch('match/updateMatches', {
          accountId: this.accountId,
          page: this.page,
        });
        this.loadingMatches = false;
      } else if (
        !this.prevScrollEnd &&
        !this.loadingMatches &&
        scrollTop + clientHeight >= scrollHeight
      ) {
        target.scrollTop = target.scrollTop - 1;
        this.prevScrollEnd = true;
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
    height: 60px;
  }

  .cursor-none {
    user-select: none;
  }
</style>
