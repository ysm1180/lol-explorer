<template>
  <v-card flat>
    <v-layout column>
      <match-team-detail
        :queue="match.queue"
        :requester="gameInfo.requester"
        :team="gameInfo.teams['200']"
        teamName="레드"
      />

      <match-team-detail
        :queue="match.queue"
        :requester="gameInfo.requester"
        :team="gameInfo.teams['100']"
        teamName="블루"
      />
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MatchTeamDetail from '@/components/Match/MatchTeamDetail.vue';
import { IMatchApiData } from '@/typings/match';

@Component({
  components: {
    MatchTeamDetail,
  },
  filters: {
    gold(val: number) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
})
export default class MatchDetail extends Vue {
  @Prop() public match!: IMatchApiData;

  get gameInfo() {
    return this.match.gameInfo;
  }

  public mounted() {}
}
</script>
<style scoped></style>
