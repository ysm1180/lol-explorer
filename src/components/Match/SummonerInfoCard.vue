<template>
  <v-card class="summoner-info-card" color="transparent" flat>
    <v-layout>
      <div>
        <v-img :src="summoner.iconUrl" class="summoner-icon">
          <span
            class="summoner-level font-weight-bold text-xs-center white--text"
          >
            {{ summoner.summonerLevel }}
          </span>
        </v-img>
      </div>

      <v-flex class="summoner-info mx-3">
        <v-layout column justify-center>
          <span class="headline font-weight-bold mb-1">
            {{ summoner.name }}
          </span>
          <v-btn
            :disabled="renewing"
            @click="$emit('renew')"
            block
            class="button__large deep-orange lighten-2"
            flat
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
        <span class="sub-text">최근 업데이트: {{ timeDeltaTextByNow }}</span>
      </v-flex>
    </v-layout>
    <v-layout class="my-2" column>
      <v-flex class="mb-1">
        <tier-card :season="soloRank" queueId="420" />
      </v-flex>
      <v-flex>
        <tier-card :season="flexRank" queueId="440" />
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { QUEUE_TYPE, QUEUE_TYPE_STRING } from '@/common/constants';
import { END_POINT } from '@/config';
import { IMatchApiData } from '@/typings/match';
import { ISummonerApiData } from '@/typings/summoner';
import axios from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';
import TierCard from './TierCard.vue';

@Component({
  components: {
    TierCard,
  },
})
export default class SummonerInfoCard extends Vue {
  @Prop() private summoner!: ISummonerApiData;
  @Prop() private renewing: boolean = false;

  public async loadUnrankedMatchInfo(queueId: number) {
    try {
      const response = await axios.get(
        `${END_POINT}/summoner/matches/unranked/${
          this.summoner.accountId
        }/${queueId}`
      );
      const matches: IMatchApiData[] = response.data;
      const matchCount = matches.length;
      const winCount = matches.filter((match) => match.gameInfo.requester.isWin)
        .length;

      const result = {
        tier: 'UNRANKED',
        rank: '',
        queueType: QUEUE_TYPE_STRING[queueId],
        leaguePoints: 0,
        summonerId: this.summoner.id,
        summonerName: this.summoner.name,
        wins: winCount,
        losses: matchCount - winCount,
      };
      this.summoner.seasons.push(result);
    } catch (err) {
      console.log(err);
    }
  }

  public get soloRank() {
    const season = this.summoner.seasons.find((season: any) => {
      return season.queueType === 'RANKED_SOLO_5x5';
    });

    if (season) {
      return season;
    } else {
      this.loadUnrankedMatchInfo(QUEUE_TYPE.RANKED_SOLO_5x5);
      return null;
    }
  }

  public get flexRank() {
    const season = this.summoner.seasons.find((season: any) => {
      return season.queueType === 'RANKED_FLEX_SR';
    });

    if (season) {
      return season;
    } else {
      this.loadUnrankedMatchInfo(QUEUE_TYPE.RANKED_FLEX_SR);
      return null;
    }
  }

  get timeDeltaTextByNow() {
    let utcNow = new Date(new Date().toUTCString()).getTime();
    const updatedTs = new Date(this.summoner.updatedTs).getTime();
    if (utcNow < updatedTs) {
      utcNow = updatedTs;
    }
    const sinceAfterSeconds = Math.floor((utcNow - updatedTs) / 1000);
    let sinceTimeText = '';
    if (sinceAfterSeconds < 60) {
      sinceTimeText = `${sinceAfterSeconds}초 전`;
    } else if (sinceAfterSeconds < 3600) {
      sinceTimeText = `${Math.ceil(sinceAfterSeconds / 60)}분 전`;
    } else if (sinceAfterSeconds < 86400) {
      sinceTimeText = `${Math.ceil(sinceAfterSeconds / 3600)}시간 전`;
    } else {
      sinceTimeText = `${Math.ceil(sinceAfterSeconds / 86400)}일 전`;
    }
    return sinceTimeText;
  }
}
</script>
<style lang="scss" scoped>
.button__large {
  width: 200px;
}

.summoner-icon {
  width: 100px;
  height: 100px;
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

.summoner-info {
  text-align: left;

  .sub-text {
    font-size: 11px;
    color: gray;
  }
}
</style>
