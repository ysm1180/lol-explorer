<template>
  <v-layout px-3 py-1 column fill-height>
    <v-flex mb-3>
      <v-layout>
        <v-flex xs2>챔피언</v-flex>
        <v-flex xs1>게임수</v-flex>
        <v-flex xs1>승률</v-flex>
        <v-flex xs3>평점 (KDA)</v-flex>
        <v-flex xs1>평균 CS</v-flex>
        <v-flex xs2>평균 골드</v-flex>
      </v-layout>
    </v-flex>
    <v-flex mb-2 v-bind:key="champion.key" v-for="champion in data">
      <v-layout v-if="champion.wins !== null">
        <v-flex xs2>
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
            ((champion.wins * 100) / (champion.wins + champion.losses)).toFixed(
              2
            )
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
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ChampionInfoDetail extends Vue {
  @Prop() private data!: any[];
  @Prop() private count!: number;

  get staticChampions() {
    return this.$store.state.lolstatic.champions;
  }
}
</script>

<style scoped>
.champion-icon {
  max-width: 23px;
  max-height: 23px;
}
</style>
