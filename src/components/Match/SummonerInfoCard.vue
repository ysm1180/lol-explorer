<template>
  <v-card height="100%" flat class="summoner-info-card blue-grey darken-3">
    <v-layout fill-height row>
      <v-flex xs3>
        <v-layout fill-height align-center justify-center>
          <v-img class="summoner-icon" :src="summoner.iconUrl">
            <span class="summoner-level font-weight-bold text-xs-center white--text deep-purple darken-2 px-3">{{summoner.summonerLevel}}</span>
          </v-img>
        </v-layout>
      </v-flex>
      <v-flex xs3 pa-2>
        <v-layout fill-height column align-baseline justify-center>
          <span class="headline font-weight-bold mb-1 white--text">{{summoner.name}}</span>
          <v-btn class="blue lighten-2" @click="$emit('renew')" :disabled="renewing">
            <span class="white--text font-weight-bold">전적 갱신</span>
            <v-progress-circular v-if="renewing" class="ml-3" color="white" size="20" indeterminate />
          </v-btn>
        </v-layout>
      </v-flex>
      <v-flex xs3>
        <tier-card :season="solo" queueType="solo" />
      </v-flex>
      <v-flex xs3>
        <tier-card :season="free" queueType="free" />
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
  @Prop() renewing!: boolean
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
  max-width: 100px;
  max-height: 100px;
  background-size: cover;
}
.summoner-level {
  width: 50px;
  border-radius: 5px;
  z-index: 3;
  padding: 1px;
}
</style>