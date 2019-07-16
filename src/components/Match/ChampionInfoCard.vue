<template>
  <v-card class="summoner-info-card blue-grey darken-3" dark flat height="100%">
    <v-tabs
      class="mb-1 grey darken-4"
      dark
      fixed-tabs
      height="40"
      slider-color="blue"
      v-model="tab"
    >
      <v-tab class="cursor-pointer">전체</v-tab>
      <v-tab class="cursor-pointer">솔랭</v-tab>
      <v-tab class="cursor-pointer">자유랭</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-layout class="grey darken-3" column fill-height>
          <v-flex mb-3>
            <v-layout>
              <v-flex xs4>최근 {{ champions.totalGames }} 게임</v-flex>
              <v-flex xs1>게임수</v-flex>
              <v-flex xs1>승률</v-flex>
              <v-flex xs3>K/D/A</v-flex>
              <v-flex xs1>평균 CS</v-flex>
              <v-flex xs2>평균 골드</v-flex>
            </v-layout>
          </v-flex>
          <v-flex mb-2 v-bind:key="champion.key" v-for="champion in totalArray">
            <v-layout v-if="champion.wins !== null">
              <v-flex xs4>
                <v-layout align-center>
                  <v-img
                    :src="staticChampions[champion.key].iconUrl"
                    class="champion-icon mr-2"
                  />
                  <span>{{ staticChampions[champion.key].name }}</span>
                </v-layout>
              </v-flex>
              <v-flex xs1>{{ champion.wins + champion.losses }}</v-flex>
              <v-flex xs1>
                {{
                  (
                    (champion.wins * 100) /
                    (champion.wins + champion.losses)
                  ).toFixed(2)
                }}%
              </v-flex>
              <v-flex xs3>
                {{ champion.averageKills.toFixed(1) }}/{{
                  champion.averageDeaths.toFixed(1)
                }}/{{ champion.averageAssists.toFixed(1) }}
              </v-flex>
              <v-flex xs1>{{ champion.averageCS.toFixed(2) }}</v-flex>
              <v-flex xs2>{{ champion.averageEarnedGold.toFixed(2) }}</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-tab-item>
      <v-tab-item>
        <v-layout class="grey darken-3" column fill-height>
          <v-flex mb-3>
            <v-layout>
              <v-flex xs4>최근 {{ champions.totalGames }} 게임</v-flex>
              <v-flex xs1>게임수</v-flex>
              <v-flex xs1>승률</v-flex>
              <v-flex xs3>K/D/A</v-flex>
              <v-flex xs1>평균 CS</v-flex>
              <v-flex xs2>평균 골드</v-flex>
            </v-layout>
          </v-flex>
          <v-flex mb-2 v-bind:key="champion.key" v-for="champion in soloArray">
            <v-layout v-if="champion.wins !== null">
              <v-flex xs4>
                <v-layout align-center>
                  <v-img
                    :src="staticChampions[champion.key].iconUrl"
                    class="champion-icon mr-2"
                  />
                  <span>{{ staticChampions[champion.key].name }}</span>
                </v-layout>
              </v-flex>
              <v-flex xs1>{{ champion.wins + champion.losses }}</v-flex>
              <v-flex xs1>
                {{
                  (
                    (champion.wins * 100) /
                    (champion.wins + champion.losses)
                  ).toFixed(2)
                }}%
              </v-flex>
              <v-flex xs3>
                {{ champion.averageKills.toFixed(1) }}/{{
                  champion.averageDeaths.toFixed(1)
                }}/{{ champion.averageAssists.toFixed(1) }}
              </v-flex>
              <v-flex xs1>{{ champion.averageCS.toFixed(2) }}</v-flex>
              <v-flex xs2>{{ champion.averageEarnedGold.toFixed(2) }}</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-tab-item>
      <v-tab-item>
        <v-layout class="grey darken-3" column fill-height>
          <v-flex mb-3>
            <v-layout>
              <v-flex xs4>최근 {{ champions.totalGames }} 게임</v-flex>
              <v-flex xs1>게임수</v-flex>
              <v-flex xs1>승률</v-flex>
              <v-flex xs3>K/D/A</v-flex>
              <v-flex xs1>평균 CS</v-flex>
              <v-flex xs2>평균 골드</v-flex>
            </v-layout>
          </v-flex>
          <v-flex mb-2 v-bind:key="champion.key" v-for="champion in flexArray">
            <v-layout v-if="champion.wins !== null">
              <v-flex xs4>
                <v-layout align-center>
                  <v-img
                    :src="staticChampions[champion.key].iconUrl"
                    class="champion-icon mr-2"
                  />
                  <span>{{ staticChampions[champion.key].name }}</span>
                </v-layout>
              </v-flex>
              <v-flex xs1>{{ champion.wins + champion.losses }}</v-flex>
              <v-flex xs1>
                {{
                  (
                    (champion.wins * 100) /
                    (champion.wins + champion.losses)
                  ).toFixed(2)
                }}%
              </v-flex>
              <v-flex xs3>
                {{ champion.averageKills.toFixed(1) }}/{{
                  champion.averageDeaths.toFixed(1)
                }}/{{ champion.averageAssists.toFixed(1) }}
              </v-flex>
              <v-flex xs1>{{ champion.averageCS.toFixed(2) }}</v-flex>
              <v-flex xs2>{{ champion.averageEarnedGold.toFixed(2) }}</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {},
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
<style scoped>
.champion-icon {
  max-width: 20px;
  max-height: 20px;
}
</style>
