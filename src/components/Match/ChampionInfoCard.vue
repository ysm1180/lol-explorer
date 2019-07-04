<template>
  <v-card height="100%" flat class="summoner-info-card blue-grey darken-3">
    <v-layout fill-height column>
      <v-flex mb-3>
        <v-layout>
          <v-flex xs4>최근 {{champions.totalGames}} 게임</v-flex>
          <v-flex xs1>게임수</v-flex>
          <v-flex xs1>승률</v-flex>
          <v-flex xs3>K/D/A</v-flex>
          <v-flex xs1>평균 CS</v-flex>
          <v-flex xs2>평균 골드</v-flex>
        </v-layout>
      </v-flex>
      <v-flex v-for="champion in championsArray" v-bind:key="champion.key" mb-2>
        <v-layout>
          <v-flex xs4>
            <v-layout align-center>
              <v-img :src="staticChampions[champion.key].iconUrl" class="champion-icon mr-2" />
              <span>{{staticChampions[champion.key].name}}</span>
            </v-layout>
          </v-flex>
          <v-flex xs1>{{champion.wins + champion.losses}}</v-flex>
          <v-flex xs1>{{(champion.wins * 100 / (champion.wins + champion.losses)).toFixed(2)}}%</v-flex>
          <v-flex
            xs3
          >{{champion.averageKills.toFixed(1)}}/{{champion.averageDeaths.toFixed(1)}}/{{champion.averageAssists.toFixed(1)}}</v-flex>
          <v-flex xs1>{{champion.averageCS.toFixed(2)}}</v-flex>
          <v-flex xs2>{{champion.averageEarnedGold.toFixed(2)}}</v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class ChampionInfoCard extends Vue {
  @Prop() public champions: any;

  public mounted() {}

  get championsArray() {
    const champions = this.champions.champions;
    const championsArray = Object.values(champions);
    championsArray.sort((a: any, b: any) => {
      return b.wins + b.losses - (a.wins + a.losses);
    });
    return championsArray;
  }
  get staticChampions() {
    return this.$store.state.lolstatic.champions;
  }
}
</script>
<style scoped>
.champion-icon {
  max-width: 20px;
  max-height: 20px;
}
</style>