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
          v-for="(match, key) in matches"
          v-bind:key="key"
          class="match-card-wrap"
          mb-3
        >
          <match-card
            :match="match"
          />
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';
import { Component, Vue, Prop } from 'vue-property-decorator';
import SummonerInfoCard from './SummonerInfoCard.vue';
import MatchCard from './MatchCard.vue'

@Component({
  components: {
    'match-card': MatchCard,
    'summoner-info-card': SummonerInfoCard,
  },
})
export default class Index extends Vue {
  async mounted() {
    await this.$store.dispatch('match/updateMatches', this.summoner.accountId)
  }

  get summoner () {
    return this.$store.state.connection.summoner
  }
  get matches () {
    return this.$store.state.match.matches
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
  height: 120px;
}
</style>
