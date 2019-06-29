<template>
  <v-layout fill-height column align-center>
    <v-flex id="summoner-info" ma-5 style="max-width:750px;min-width:600px;">
      <summoner-info-card
        :summoner="summoner"
      />
    </v-flex>
    <v-flex id="match-info" style="max-width:750px;min-width:600px;">
      <v-layout column fill-height>
        <v-flex
          v-for="(match, index) in matches"
          v-bind:key="index"
          mb-2 style="cursor:pointer"
          @click="toggle(index)"
        >
          <div class="match-card-wrap">
            <match-card
              :match="match"
            />
          </div>
          <div class="match-detail-wrap" v-if="toggleArray.includes(index)">
            <match-detail
              :match="match"
            />
          </div>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';
import { Component, Vue, Prop } from 'vue-property-decorator';
import SummonerInfoCard from './SummonerInfoCard.vue';
import MatchCard from './MatchCard.vue';
import MatchDetail from './MatchDetail.vue';

@Component({
  components: {
    'match-card': MatchCard,
    'match-detail': MatchDetail,
    'summoner-info-card': SummonerInfoCard,
  },
})
export default class Index extends Vue {
  toggleArray: Array<number> = []
  async mounted() {
    await this.$store.dispatch('match/updateMatches', this.summoner.accountId)
  }

  get summoner () {
    return this.$store.state.connection.summoner
  }
  get matches () {
    return this.$store.state.match.matches
  }

  toggle(index: number) {
    if (this.toggleArray.includes(index)) {
      const idx = this.toggleArray.indexOf(index)
      this.toggleArray.splice(idx, 1)
    } else {
      this.toggleArray.push(index)
    }
  }
}
</script>
<style scoped>
#summoner-info {
  width: 70%;
  min-height: 150px;
}
#match-info {
  width: 70%;
}
.match-card-wrap {
  width: 100%;
  height: 50px;
}
.match-detail-wrap {
}
</style>
