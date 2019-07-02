<template>
  <v-card height="100%" flat class="summoner-info-card">
    <v-layout fill-height row>
      <v-flex xs3>
        <v-layout fill-height align-center justify-center>
          <div class="summoner-icon" :style="`background-image:url(${summoner.iconUrl})`">
            <span class="summoner-level">{{summoner.summonerLevel}}</span>
          </div>
        </v-layout>
      </v-flex>
      <v-flex xs9 pa-2>
        <v-layout fill-height column align-baseline>
          <v-flex xs3 style="width:100%" text-xs-left>
            <span class="headline font-weight-bold mr-2">{{summoner.name}}</span>
          </v-flex>
          <v-flex xs9 style="width:100%">
            <v-layout fill-height row style="max-height:130px;">
              <v-flex xs5 mr-3>
                <tier-card :season="solo" queueType="solo" />
              </v-flex>
              <v-flex xs5 ml-3>
                <tier-card :season="free" queueType="free" />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';
import { Component, Vue, Prop } from 'vue-property-decorator';
import TierCard from './TierCard.vue';

@Component({
  components: {
    'tier-card': TierCard,
  },
})
export default class SummonerInfoCard extends Vue {
  @Prop() summoner: any
  solo = null
  free = null

  mounted() {
    this.summoner.seasons.forEach((season: any) => {
      if (season.queueType === 'RANKED_SOLO_5x5') {
        this.solo = season
      } else if (season.queueType === 'RANKED_FLEX_SR') {
        this.free = season
      }
    })
  }
}
</script>
<style scoped>
.summoner-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-size: cover;
}
.summoner-level {
  position: absolute;
      top: 100%;
      text-align: center;
      width: 50px;
      left: 50%;
      margin-left: -25px;
      margin-top: -15px;
      color: white;
      font-size: 12px;
      font-weight: bold;
      border: 1px solid #3a3a3a;
      border-radius: 5px;
      background-color: #1b2838;
      padding: 1px;
}
</style>