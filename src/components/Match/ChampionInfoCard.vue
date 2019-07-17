<template>
  <v-card color="#EDEDED" class="summoner-info-card" height="100%">
    <Tabs class="mb-1">
      <Tab
        class="cursor-pointer"
        :name="'전체(' + champions.totalGames + ')'"
        :selected="true"
      >
        <ChampionInfoDetail
          :count="champions.totalGames"
          :data="totalArray"
        ></ChampionInfoDetail>
      </Tab>
      <Tab class="cursor-pointer" name="솔로 랭크">
        <ChampionInfoDetail
          :count="champions.totalGames"
          :data="soloArray"
        ></ChampionInfoDetail>
      </Tab>
      <Tab class="cursor-pointer" name="자유 랭크">
        <ChampionInfoDetail
          :count="champions.totalGames"
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
    const championsTotalArray: any[] = [];
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
    const championsSoloArray: any[] = [];
    championsArray.forEach((element: any) => {
      if (Object.entries(element.solo).length !== 0) {
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
    const championsFlexArray: any[] = [];
    championsArray.forEach((element: any) => {
      if (Object.entries(element.flex).length !== 0) {
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
