<template>
  <v-card height="100%" flat class="summoner-info-card">
    <v-layout fill-height row>
      <v-flex xs3>
        <v-layout fill-height align-center justify-center>
          <div class="summoner-icon" :style="`background-image:url(${summoner.iconUrl})`">
          </div>
        </v-layout>
      </v-flex>
      <v-flex xs9 pa-4>
        <v-layout fill-height column align-baseline>
          <v-flex xs5>
            <span class="headline font-weight-bold mr-2">{{summoner.name}}</span>
            <span class="cyan--text">(level. {{summoner.summonerLevel}})</span>
          </v-flex>
          <v-flex xs2>
            <span class="purple--text font-weight-bold mr-1">{{summoner.seasons[0].tier}}</span>
            <span class="purple--text font-weight-bold">{{summoner.seasons[0].rank}}</span>
          </v-flex>
          <v-flex xs2>
            <span class="font-weight-bold">{{summoner.seasons[0].leaguePoints}}LP</span>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class SummonerInfoCard extends Vue {
  @Prop() summoner: any

  mounted() {
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
</style>