<template>
  <v-layout fill-height justify-center>
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
        롤 클라이언트를 실행해주세요.
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
      <v-flex
        id="summoner-info"
        mb-3
        mt-4
        style="min-width:800px;width:800px;max-height:284px;"
      >
        <summoner-info-card
          :renewing="renewing"
          :summoner="summoner"
          @renew="renew"
          v-if="summoner !== null"
        />
        <v-layout
          align-center
          fill-height
          justify-center
          v-if="loadingSummoner"
        >
          <v-progress-circular color="deep-orange lighten-2" indeterminate />
        </v-layout>
      </v-flex>
      <Tabs :onSelected="onTabSelected">
        <Tab :selected="true" name="전적">
          <v-layout
            column
            fill-height
            mb-5
            style="min-width:800px;width:800px;"
          >
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
            <v-flex text-center>
              <v-progress-circular
                color="deep-orange lighten-2"
                indeterminate
                v-if="loadingMatches"
              />
            </v-flex>
          </v-layout>
        </Tab>
        <Tab class="font-weight-bold" name="챔피언 분석">
          <v-layout mb-5 style="min-width:700px;width:800px;">
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
              ></v-layout>
            </v-flex>
          </v-layout>
        </Tab>
      </Tabs>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import ChampionInfoCard from '@/components/Match/ChampionInfoCard.vue';
import MatchCard from '@/components/Match/MatchCard.vue';
import MatchDetail from '@/components/Match/MatchDetail.vue';
import SummonerInfoCard from '@/components/Match/SummonerInfoCard.vue';
import Tab from '@/components/UI/Tab/Tab.vue';
import Tabs from '@/components/UI/Tab/Tabs.vue';
import { END_POINT } from '@/config';
import { MatchApiData } from '@/typings/match';
import axios from 'axios';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {
    Tab,
    Tabs,
    MatchCard,
    ChampionInfoCard,
    MatchDetail,
    SummonerInfoCard,
  },
})
export default class Match extends Vue {
  @Prop(String) private accountId!: string;
  private summoner: any = null;
  private matches: MatchApiData[] = [];
  private champions: any = null;
  private page: number = 0;
  private toggleArray: number[] = [];
  private renewing: boolean = false;
  private loadingSummoner: boolean = true;
  private loadingChampion: boolean = true;
  private loadingMatches: boolean = true;
  private prevScrollEnd: boolean = false;
  private selectedTabIndex: number = 0;

  @Watch('$route')
  public onRouteChanged(to: any, from: any) {
    this.page = 0;
    this.matches = [];
    this.summoner = null;
    this.toggleArray = [];
    this.loadingSummoner = true;
    this.loadingMatches = true;
    this.loadingChampion = true;
    this.init();
  }

  public mounted() {
    this.init();
  }

  public async init() {
    if (this.accountId) {
      const summonerCache = window.sessionStorage.getItem(
        `summoner_${this.accountId}`
      );
      if (!summonerCache) {
        const response = await axios.get(
          `${END_POINT}/summoner/byAccount/${this.accountId}`
        );
        this.summoner = response.data;
        window.sessionStorage.setItem(
          `summoner_${this.accountId}`,
          JSON.stringify(this.summoner)
        );
      } else {
        this.summoner = { ...JSON.parse(summonerCache) };
      }
      this.loadingSummoner = false;

      this.loadingMatches = true;
      const matchListCache = window.sessionStorage.getItem(
        `matches_${this.accountId}`
      );
      if (!matchListCache) {
        await this.updateMatches(this.page);
        window.sessionStorage.setItem(
          `matches_${this.accountId}`,
          JSON.stringify(this.matches)
        );
      } else {
        this.matches = JSON.parse(matchListCache);
      }
      this.loadingMatches = false;

      this.loadingChampion = true;
      const championListCache = window.sessionStorage.getItem(
        `champions_${this.accountId}`
      );
      if (!championListCache) {
        await this.updateSummonerChampions();
      } else {
        this.champions = JSON.parse(championListCache);
      }
      this.loadingChampion = false;
    }
  }

  get status() {
    return this.$store.state.connection.status;
  }

  public async updateMatches(page: number) {
    const start = page * 20;
    const response = await axios.get(
      `${END_POINT}/summoner/matches/${this.accountId}/${start}/20`
    );
    if (page === 0) {
      this.matches = response.data;
    } else {
      this.matches = this.matches.concat(response.data);
    }
  }

  public async updateSummonerChampions() {
    const response = await axios.get(
      `${END_POINT}/summoner/rift/champions/${this.accountId}`
    );
    this.champions = response.data;
    window.sessionStorage.setItem(
      `champions_${this.accountId}`,
      JSON.stringify(this.champions)
    );
  }

  public async renew() {
    this.renewing = true;
    try {
      await axios.post(`${END_POINT}/summoner/${this.summoner.name}`);
      const response = await axios.get(
        `${END_POINT}/summoner/byAccount/${this.accountId}`
      );
      this.summoner = response.data;
      window.sessionStorage.setItem(
        `summoner_${this.accountId}`,
        JSON.stringify(this.summoner)
      );

      this.page = 0;
      this.loadingMatches = true;
      await this.updateMatches(this.page);
      window.sessionStorage.setItem(
        `matches_${this.accountId}`,
        JSON.stringify(this.matches)
      );
      this.loadingMatches = false;

      this.loadingChampion = true;
      await this.updateSummonerChampions();
      this.loadingChampion = false;
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
      this.selectedTabIndex === 0 &&
      !this.loadingMatches &&
      this.prevScrollEnd &&
      scrollTop + clientHeight >= scrollHeight
    ) {
      this.prevScrollEnd = false;
      this.page += 1;

      this.loadingMatches = true;
      await this.updateMatches(this.page);
      this.loadingMatches = false;

      this.loadingChampion = true;
      await this.updateSummonerChampions();
      this.loadingChampion = false;
    } else if (
      !this.prevScrollEnd &&
      !this.loadingMatches &&
      scrollTop + clientHeight >= scrollHeight
    ) {
      target.scrollTop = target.scrollTop - 1;
      this.prevScrollEnd = true;
    }
  }

  public onTabSelected(index: number) {
    this.selectedTabIndex = index;
  }
}
</script>
<style scoped>
#match-page {
  overflow-y: auto;
}
</style>
