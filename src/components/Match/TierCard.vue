<template>
  <v-card height="100%" flat class="tier-card">
    <v-layout fill-height justify-start v-if="season !== null">
      <v-flex mr-3>
        <v-img :src="`/assets/emblems/${season.tier}.png`" style="width:100px; height:100px;"/>
      </v-flex>
      <v-flex align-self-center>
        <v-layout fill-height column justify-center>
          <v-flex v-if="queueType==='free'" text-xs-left font-weight-bold>자유랭</v-flex>
          <v-flex v-if="queueType==='solo'" text-xs-left font-weight-bold>솔로</v-flex>
          <v-flex text-xs-left>
            <span class="purple--text font-weight-bold mr-1">{{season.tier}}</span>
            <span class="purple--text font-weight-bold">{{season.rank}}</span>
          </v-flex>
          <v-flex text-xs-left>
            <span class="font-weight-bold">{{season.leaguePoints}}LP</span>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout v-else column fill-height>
      <v-flex v-if="queueType==='free'" font-weight-bold mt-3>자유랭</v-flex>
      <v-flex v-if="queueType==='solo'" font-weight-bold mt-3>솔로</v-flex>
      <v-flex purple--text font-weight-bold>Unranked</v-flex>
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