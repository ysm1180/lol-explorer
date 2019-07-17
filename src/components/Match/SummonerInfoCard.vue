<template>
  <v-card class="summoner-info-card" color="transparent" flat height="100%">
    <v-layout fill-height row>
      <v-flex xs3>
        <v-layout align-center fill-height justify-center>
          <v-img :src="summoner.iconUrl" class="summoner-icon">
            <span
              class="summoner-level font-weight-bold text-xs-center white--text"
            >
              {{ summoner.summonerLevel }}
            </span>
          </v-img>
        </v-layout>
      </v-flex>
      <v-flex pa-2 xs3>
        <v-layout align-baseline column fill-height justify-center>
          <span class="headline font-weight-bold mb-1">
            {{ summoner.name }}
          </span>
          <v-btn
            :disabled="renewing"
            @click="$emit('renew')"
            class="blue lighten-2"
          >
            <span class="white--text font-weight-bold">전적 갱신</span>
            <v-progress-circular
              class="ml-3"
              color="white"
              indeterminate
              size="20"
              v-if="renewing"
            />
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import TierCard from './TierCard.vue';

@Component({
  components: {
    'tier-card': TierCard,
  },
})
export default class SummonerInfoCard extends Vue {
  @Prop() private summoner: any;
  @Prop() private renewing: boolean = false;
  private solo = null;
  private free = null;

  public mounted() {
    this.summoner.seasons.forEach((season: any) => {
      if (season.queueType === 'RANKED_SOLO_5x5') {
        this.solo = season;
      } else if (season.queueType === 'RANKED_FLEX_SR') {
        this.free = season;
      }
    });
  }
}
</script>
<style scoped>
.summoner-icon {
  position: relative;
  max-width: 100px;
  max-height: 100px;
  background-size: cover;
}

.summoner-level {
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 50px;
  z-index: 3;

  background-color: #212121;
  border: 1px solid darkorange;
}
</style>
