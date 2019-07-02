<template>
  <v-card height="100%" flat class="tier-card" color="blue-grey darken-3 white--text">
    <v-layout fill-height align-center v-if="season !== null">
      <div class="mr-2">
        <v-flex v-if="queueType==='free'" text-xs-center font-weight-bold>자유랭</v-flex>
        <v-flex v-if="queueType==='solo'" text-xs-center font-weight-bold>솔로</v-flex>
        <v-img :src="`/assets/emblems/${season.tier}.png`" style="width:60px; height:60px;" class="mt-1"/>
      </div>
      <v-flex fill-height>
        <v-layout fill-height column justify-center align-baseline>
          <div class="cyan--text">
            <span class="font-weight-bold mr-1">{{season.tier}}</span>
            <span class="font-weight-bold">{{season.rank}}</span>
          </div>
          <span class="font-weight-bold my-1">{{season.leaguePoints}}LP</span>
          <span class="font-weight-bold">{{(season.wins * 100 / (season.wins + season.losses)).toFixed(2)}}%</span>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout v-else column fill-height>
      <v-flex v-if="queueType==='free'" font-weight-bold mt-3>자유랭</v-flex>
      <v-flex v-if="queueType==='solo'" font-weight-bold mt-3>솔로</v-flex>
      <v-flex font-weight-bold cyan--text>Unranked</v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class TierCard extends Vue {
  @Prop() season: any
  @Prop() queueType!: string

  mounted() {
  }
}
</script>
<style scoped>
</style>