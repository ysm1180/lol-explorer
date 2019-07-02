<template>
  <v-layout fill-height column align-center>
    <v-flex id="summoner-info" ma-5 style="max-width:750px;min-width:600px;">
      <summoner-info-card
        v-if="summoner!==null"
        :summoner="summoner"
      />
      <v-layout fill-height justify-center align-center>
        <v-progress-circular
          v-if="loadingSummoner"
          indeterminate
          color="grey"
        />
      </v-layout>
    </v-flex>
    <v-flex id="match-info" style="max-width:750px;min-width:600px;">
      <v-layout column fill-height>
        <v-flex
          v-for="(match, index) in matches"
          v-bind:key="index"
          mb-2
        >
          <div class="match-card-wrap"
            @click="toggle(index)"
            style="cursor:pointer"
          >
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
        <v-flex text-xs-center>
          <v-progress-circular
            v-if="loadingMatches"
            indeterminate
            color="grey"
          />
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';
import { Component, Vue, Prop, Watch, PropSync } from 'vue-property-decorator';
import axios from 'axios';
import SummonerInfoCard from '../components/Match/SummonerInfoCard.vue';
import MatchCard from '../components/Match/MatchCard.vue';
import MatchDetail from '../components/Match/MatchDetail.vue';

const ENDPOINT = 'http://localhost:3000'

@Component({
  components: {
    'match-card': MatchCard,
    'match-detail': MatchDetail,
    'summoner-info-card': SummonerInfoCard,
  },
})
export default class Index extends Vue {
  @Prop() accountId!: string
  summoner: any = null
  page: number = 0
  toggleArray: Array<number> = []
  loadingSummoner: boolean = true
  loadingMatches: boolean = true

  async mounted() {
    const response = await axios.get(`${ENDPOINT}/summoner/byAccount/${this.accountId}`)
    this.summoner = response.data
    this.loadingSummoner = false
    await this.$store.dispatch('match/updateMatches', { accountId: this.accountId, page: this.page })
    this.loadingMatches = false
    window.addEventListener('scroll', this.onScroll)
  }
  async destroyed() {
    window.removeEventListener('scroll', this.onScroll);
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
  async onScroll() {
    if (document.documentElement.scrollHeight == document.documentElement.scrollTop + window.innerHeight && !this.loadingMatches) {
      this.loadingMatches = true
      this.page += 1
      await this.$store.dispatch('match/updateMatches', { accountId: this.accountId, page: this.page })
      this.loadingMatches = false
    }
  }
}
</script>
<style scoped>
#summoner-info {
  width: 70%;
  min-height: 150px;
  max-height: 150px;
}
#match-info {
  width: 70%;
}
.match-card-wrap {
  width: 100%;
  height: 50px;
}
</style>
