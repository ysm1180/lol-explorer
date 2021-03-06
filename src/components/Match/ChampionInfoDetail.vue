<template>
  <table class="champion-info-table">
    <thead class="table__header">
      <tr class="table__row">
        <th class="table__cell number">#</th>
        <th class="table__cell champion">챔피언</th>
        <th class="table__cell win-rate">승률</th>
        <th class="table__cell kda">평점 (KDA)</th>
        <th class="table__cell cs">CS</th>
        <th class="table__cell gold">골드</th>
        <th class="table__cell triple-kills">트리플킬</th>
        <th class="table__cell quadra-kills">쿼드라킬</th>
        <th class="table__cell penta-kills">펜타킬</th>
      </tr>
    </thead>
    <tbody class="table__body">
      <tr
        class="table__row"
        v-bind:key="championData.rank"
        v-for="championData in sortedData"
      >
        <td class="table__cell rank">{{ championData.rank }}</td>
        <td class="table__cell champion">
          <v-layout align-center>
            <v-img
              :src="staticChampions[championData.championKey].iconUrl"
              class="champion-passive-icon mr-2"
            />
            <span>{{ championData.championName }}</span>
          </v-layout>
        </td>
        <td class="table__cell win-rate">
          {{ championData.wins }}승 {{ championData.losses }}패 ({{
            championData.winRate.toFixed(1)
          }}%)
        </td>
        <td class="table__cell kda">
          <div class="sub">
            {{ championData.averageKills.toFixed(1) }} /
            {{ championData.averageDeaths.toFixed(1) }} /
            {{ championData.averageAssists.toFixed(1) }}
          </div>
          <div class="main">{{ championData.kda.toFixed(2) }}</div>
        </td>
        <td class="table__cell cs">{{ championData.averageCS.toFixed(1) }}</td>
        <td class="table__cell gold">
          {{ championData.averageEarnedGold.toFixed(0) }}
        </td>
        <td class="table__cell triple-kills">{{ championData.tripleKills }}</td>
        <td class="table__cell quadra-kills">{{ championData.quadraKills }}</td>
        <td class="table__cell penta-kills">{{ championData.pentaKills }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ChampionInfoApiData } from '@/typings/match';

interface ChampionDetailData {
  rank: number;
  championKey: number;
  championName: string;
  wins: number;
  losses: number;
  winRate: number;
  averageKills: number;
  averageDeaths: number;
  averageAssists: number;
  kda: number;
  averageCS: number;
  averageEarnedGold: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
}

@Component
export default class ChampionInfoDetail extends Vue {
  @Prop() private data!: ChampionInfoApiData[];
  private sortStatus: { key: string; asc: boolean } = { key: '', asc: false };

  public get sortedData() {
    const result = [];
    for (let i = 0; i < this.data.length; i++) {
      const champion = this.data[i];
      const object: ChampionDetailData = {} as any;
      object.rank = i + 1;
      object.championKey = champion.key;
      object.championName = this.staticChampions[champion.key].name;
      object.wins = champion.wins;
      object.losses = champion.losses;
      object.winRate =
        (champion.wins * 100) / (champion.wins + champion.losses);
      object.averageKills = champion.averageKills;
      object.averageDeaths = champion.averageDeaths;
      object.averageAssists = champion.averageAssists;
      object.kda =
        (champion.averageKills + champion.averageAssists) /
        champion.averageDeaths;
      object.averageCS = champion.averageCS;
      object.averageEarnedGold = champion.averageEarnedGold;
      object.doubleKills = champion.doubleKills;
      object.tripleKills = champion.tripleKills;
      object.quadraKills = champion.quadraKills;
      object.pentaKills = champion.pentaKills;

      result.push(object);
    }

    return result;
  }

  public sort() {}

  get staticChampions() {
    return this.$store.state.lolstatic.champions;
  }
}
</script>

<style lang="scss" scoped>
.champion-info-table {
  width: 100%;
  border-spacing: 0;

  .table__header > .table__row > .table__cell {
    height: 54px;
    color: #333;
    font-size: 12px;
    font-weight: bold;
    padding: 0 10px;
    border-bottom: 1px solid #ccc;
    margin: 0;
    user-select: none;
    cursor: pointer;
  }

  .table__body > .table__row > .table__cell {
    height: 48px;
    color: #333;
    font-size: 12px;
    font-weight: bold;
    padding: 0 10px;
    border-bottom: 1px solid #ccc;
    margin: 0;

    &.kda {
      line-height: 1.5;
      & > .sub {
        font-weight: normal;
      }
    }
  }
}

.champion-passive-icon {
  min-width: 32px;
  min-height: 32px;
  max-width: 32px;
  max-height: 32px;
}
</style>
