<template>
  <v-card class="summoner-info-card" color="#EDEDED" height="100%">
    <Tabs class="mb-1">
      <Tab :name="'전체(' + champions.totalGames + ' 게임)'" :selected="true">
        <ChampionInfoDetail
          :data="totalArray"
        ></ChampionInfoDetail>
      </Tab>
      <Tab :name="'솔로랭크(' + champions.soloGames + ' 게임)'">
        <ChampionInfoDetail
          :data="soloArray"
        ></ChampionInfoDetail>
      </Tab>
      <Tab :name="'자유랭크(' + champions.flexGames + ' 게임)'">
        <ChampionInfoDetail
          :data="flexArray"
        ></ChampionInfoDetail>
      </Tab>
    </Tabs>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Tabs from '@/components/UI/Tab/Tabs.vue';
import Tab from '@/components/UI/Tab/Tab.vue';
import ChampionInfoDetail from '@/components/Match/ChampionInfoDetail.vue';
import { IChampionInfoApiData } from '@/components/Match/champion-info';

@Component({
  components: { ChampionInfoDetail, Tab, Tabs },
})
export default class ChampionInfoCard extends Vue {
  @Prop() public champions: any;
  public tab: number = 0;

  public mounted() {}

  get totalArray() {
    const champions = this.champions.champions;
    const championsArray = Object.values(champions);
    const championsTotalArray: IChampionInfoApiData[] = [];
    championsArray.forEach((element: any) => {
      if (Object.entries(element.total).length !== 0) {
        championsTotalArray.push(element.total);
      }
    });
    championsTotalArray.sort((a: any, b: any) => {
      if (a.wins + a.losses - b.wins - b.losses < 0) {
        return 1;
      }
      if (a.wins + a.losses - b.wins - b.losses > 0) {
        return -1;
      }
      return 0;
    });
    return championsTotalArray;
  }

  get soloArray() {
    const champions = this.champions.champions;
    const championsArray = Object.values(champions);
    const championsSoloArray: IChampionInfoApiData[] = [];
    championsArray.forEach((element: any) => {
      if (element.solo) {
        championsSoloArray.push(element.solo);
      }
    });
    championsSoloArray.sort((a: any, b: any) => {
      if (a.wins + a.losses - b.wins - b.losses < 0) {
        return 1;
      }
      if (a.wins + a.losses - b.wins - b.losses > 0) {
        return -1;
      }
      return 0;
    });
    return championsSoloArray;
  }

  get flexArray() {
    const champions = this.champions.champions;
    const championsArray = Object.values(champions);
    const championsFlexArray: IChampionInfoApiData[] = [];
    championsArray.forEach((element: any) => {
      if (element.flex) {
        championsFlexArray.push(element.flex);
      }
    });
    championsFlexArray.sort((a: any, b: any) => {
      if (a.wins + a.losses - b.wins - b.losses < 0) {
        return 1;
      }
      if (a.wins + a.losses - b.wins - b.losses > 0) {
        return -1;
      }
      return 0;
    });
    return championsFlexArray;
  }

  get staticChampions() {
    return this.$store.state.lolstatic.champions;
  }
}
</script>
<style scoped></style>
