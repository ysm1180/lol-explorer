<template>
  <v-layout align-center fill-height justify-center>
    <v-layout
      align-center
      fill-height
      justify-center
      v-if="status !== 'LOGIN_COMPLETE'"
    >
      <span
        class="display-1 font-weight-bold"
        v-if="status === 'WAITING_CLIENT'"
      >
        롤 클라이언트를 실행해주세요
      </span>
      <span
        class="display-1 font-weight-bold"
        v-if="status === 'WAITING_LOGIN'"
      >
        로그인을 기다리는 중...
      </span>
    </v-layout>

    <v-layout
      @scroll="onScroll"
      align-center
      column
      fill-height
      id="match-page"
      v-if="status === 'LOGIN_COMPLETE'"
    >
      <v-flex id="summoner-info" ma-5>
        <summoner-info-card
          :renewing="renewing"
          :summoner="summoner"
          @renew="renew"
          v-if="summoner !== null"
        />
        <v-layout align-center fill-height justify-center>
          <v-progress-circular
            color="grey"
            indeterminate
            v-if="loadingSummoner"
          />
        </v-layout>
      </v-flex>
      <Tabs>
        <Tab class="font-weight-bold" name="전적" :selected="true">
          <v-layout column fill-height mb-5 style="min-width:600px;width:700px;">
            <v-flex v-bind:key="index" v-for="(match, index) in matches">
              <match-card :match="match">
                <match-detail :match="match" />
              </match-card>
            </v-flex>
            <v-layout align-center fill-height justify-center my-3>
              <v-icon class="cursor__none" v-if="!loadingMatches">
                arrow_drop_down_circle
              </v-icon>
            </v-layout>
            <v-flex text-xs-center>
              <v-progress-circular
                color="grey"
                indeterminate
                v-if="loadingMatches"
              />
            </v-flex>
          </v-layout>
        </Tab>
        <Tab class="font-weight-bold" name="챔피언 분석">
          <v-layout style="min-width:700px;width:800px;" mb-5>
            <v-flex>
              <champion-info-card
                :champions="champions"
                v-if="champions !== null"
              />
              <v-layout
                align-center
                fill-height
                justify-center
                v-if="loadingChampion"
              >
                <v-progress-circular color="grey" indeterminate />
              </v-layout>
            </v-flex>
          </v-layout>
        </Tab>
      </Tabs>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import axios from 'axios';
import SummonerInfoCard from '../components/Match/SummonerInfoCard.vue';
import ChampionInfoCard from '../components/Match/ChampionInfoCard.vue';
import MatchCard from '../components/Match/MatchCard.vue';
import MatchDetail from '../components/Match/MatchDetail.vue';
import Tabs from '@/components/UI/Tab/Tabs.vue';
import Tab from '@/components/UI/Tab/Tab.vue';

const ENDPOINT = 'http://localhost:3000';

@Component({
  components: {
    Tab,
    Tabs,
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
      const response = await axios.get(
        `${ENDPOINT}/summoner/byAccount/${this.accountId}`
      );
      this.summoner = response.data;
      this.loadingSummoner = false;
      await this.$store.dispatch('match/updateMatches', {
        accountId: this.accountId,
        page: this.page,
      });
      this.loadingMatches = false;
      await this.$store.dispatch('match/fetchChampions', {
        seasonId: 13,
        accountId: this.accountId,
      });
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

  public async onScroll({ target }: any) {
    const { scrollTop, clientHeight, scrollHeight } = target;

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

.match-card-wrap {
  width: 100%;
  height: 70px;
}
</style>
