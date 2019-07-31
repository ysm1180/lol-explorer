<template>
  <v-card class="tier-card pa-2" flat>
    <v-layout align-center fill-height>
      <div class="mr-3">
        <v-img
          :src="`/assets/emblems/${season.tier}.png`"
          class="mt-1"
          style="width:60px; height:60px;"
          v-if="season !== null"
        />
        <v-img
          :src="`/assets/emblems/unranked.png`"
          class="mt-1"
          style="width:60px; height:60px;"
          v-else
        />
      </div>

      <div class="queue mr-3">
        <div class="font-weight-bold" v-if="queueType === 'free'">
          자유 5:5 랭크
        </div>
        <div class="font-weight-bold" v-if="queueType === 'solo'">
          솔로 랭크
        </div>
      </div>

      <div class="info font-weight-bold mr-3" v-if="season !== null">
        <div>
          <span class="mr-1 purple--text">{{ season.tier }}</span>
          <span class="mr-2 purple--text">{{ season.rank }}</span>
          <span>{{ season.leaguePoints }}LP</span>
        </div>
        <span class="font-weight-bold caption">
          {{ season.wins }}승 {{ season.losses }}패
        </span>
        <span class=" catpion">
          ({{
            ((season.wins * 100) / (season.wins + season.losses)).toFixed(2)
          }}%)
        </span>
      </div>
      <div class="info" v-else>
        <div class="grey--text font-weight-bold">
          Unranked
        </div>
      </div>

      <div v-if="season">
        <div
          class="promotion d-inline-block"
          v-if="season.miniSeries && season.miniSeries.length > 0"
          v-for="result in season.miniSeries[0].progress.split('')"
        >
          <div class="blue lighten-4 blue--text" v-if="result === 'W'">
            승
          </div>
          <div class="red lighten-4 red--text" v-else-if="result === 'L'">
            패
          </div>
          <div class="grey white--text" v-else>
            ?
          </div>
        </div>
      </div>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { ISummonerSeason } from '@/typings/summoner';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class TierCard extends Vue {
  @Prop() private season!: ISummonerSeason;
  @Prop() private queueType!: 'solo' | 'free';

  public mounted() {}
}
</script>
<style lang="scss" scoped>
.tier-card {
  border: 1px solid #aaa;
  border-left: 3px solid darkorange;

  .queue {
    width: 90px;
    text-align: left;
  }

  .info {
    text-align: left;
    margin-right: 10px;
  }

  .promotion {
    vertical-align: top;

    & > div {
      width: 25px;
      height: 25px;

      font-size: 12px;
      padding: 3px;
      font-weight: bold;
      border: 1px solid grey;
      margin-right: 3px;
      color: #333;
      border-radius: 50%;
    }
  }
}
</style>
