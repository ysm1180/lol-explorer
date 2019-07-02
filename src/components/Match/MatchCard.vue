<template>
  <v-card flat height="100%" class="lighten-4" :class="gameInfo.requester.isWin?'blue':'red'">
    <v-layout justify-space-between>
      <v-flex class="matchinfo-area1">
        <v-img :src="champions[requester.championId].iconUrl" class="requester-champ-icon">
          <span class="white--text font-size-small font-weight-bold">{{champions[requester.championId].name}}</span>
        </v-img>
      </v-flex>
      <v-flex class="matchinfo-area2">
        <v-layout fill-height column justify-center>
          <span class="font-size-small font-weight-bold">{{queueString}}</span>
          <span class="font-size-small" :class="gameInfo.requester.isWin?'blue--text':'red--text'">{{gameInfo.requester.isWin?'승리':'패배'}}</span>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area3">
        <v-layout fill-height column justify-center>
          <span class="font-size-small font-weight-bold">평점 {{((requester.stats.kills + requester.stats.assists) / requester.stats.deaths).toFixed(2)}}</span>
          <span class="caption">{{requester.stats.kills}} / {{requester.stats.deaths}} / {{requester.stats.assists}}</span>
          <span class="font-size-small green--text">{{getSucceededKillString(requester)}}</span>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area4">
        <v-layout fill-height column justify-center>
          <span class="font-size-small">레벨 {{requester.stats.champLevel}}</span>
          <span class="font-size-small font-weight-bold">골드 {{requester.stats.goldEarned}}</span>
          <span class="font-size-small">CS {{requester.stats.totalMinionsKilled}}</span>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area5">
        <v-layout fill-height column justify-center>
          <div>
            <v-layout>
              <v-img :src="spells[requester.spells[0]].iconUrl" class="requester-spell-icon" />
              <v-img :src="spells[requester.spells[1]].iconUrl" class="requester-spell-icon" />
            </v-layout>
          </div>
          <div>
            <v-layout>
              <v-img :src="`https://ddragon.leagueoflegends.com/cdn/img/${getPerkUrl(requester, 1)}`" class="requester-perk-icon" />
              <v-img :src="`https://ddragon.leagueoflegends.com/cdn/img/${getPerkUrl(requester, 2)}`" class="requester-perk-icon" />
            </v-layout>
          </div>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area6">
        <v-layout fill-height column justify-center>
          <div>
            <v-layout>
              <v-img v-for="(item, index) in requester.items.slice(0,3)" v-bind:key="index" :src="item!==0?items[item].iconUrl:''" class="requester-item-icon grey lighten-2" />
            </v-layout>
          </div>
          <div>
            <v-layout>
              <v-img v-for="(item, index) in requester.items.slice(3,7)" v-bind:key="index" :src="item!==0?items[item].iconUrl:''" class="requester-item-icon grey lighten-2" />
            </v-layout>
          </div>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area7">
        <v-layout fill-height column justify-center>
          <span class="font-size-small">{{durationString}}</span>
          <span class="font-size-small">{{timeDeltaTextByNow}}</span>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area8">
        <v-layout fill-height column justify-center>
          <div>
            <v-layout mb-1>
              <v-img v-for="(participant, key) in gameInfo.teams['100'].participants" v-bind:key="key" :src="champions[participant.championId].iconUrl" class="participant-icon" />
            </v-layout>
          </div>
          <div>
            <v-layout>
              <v-img v-for="(participant, key) in gameInfo.teams['200'].participants" v-bind:key="key" :src="champions[participant.championId].iconUrl" class="participant-icon" />
            </v-layout>
          </div>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area9">
        <v-layout fill-height align-center>
          <v-icon>arrow_drop_down</v-icon>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { format } from 'util';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class MatchCard extends Vue {
  @Prop() match: any

  get champions() {
    return this.$store.state.lolstatic.champions
  }
  get items() {
    return this.$store.state.lolstatic.items
  }
  get spells() {
    return this.$store.state.lolstatic.spells
  }
  get perks() {
    return this.$store.state.lolstatic.perks
  }
  get gameInfo() {
    return this.match.gameInfo
  }
  get requester() {
    const { participantId, teamId } = this.gameInfo.requester
    return this.gameInfo.teams[teamId].participants[participantId]
  }

  get queueString() {
    let str = ''
    if (this.match.queue === 420) {
      str = '개인/2인 랭크'
    } else if (this.match.queue === 430) {
      str = '일반'
    } else if (this.match.queue === 440) {
      str = '자유 랭크'
    } else if (this.match.queue === 450) {
      str = '무작위 총력전'
    }
    return str
  }

  get timeDeltaTextByNow() {
    const utcNow = new Date(new Date().toUTCString()).getTime();
    const sinceAfterSeconds = Math.floor((utcNow - this.match.timestamp) / 1000);
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

  get durationString() {
    const { gameDuration } = this.match.gameInfo
    const secondStr = format('%d', gameDuration % 60).padStart(2, '0');
    const minuteStr = format('%d', Math.floor(gameDuration / 60)).padStart(2, '0');
    const durationTimeStr = `${minuteStr}분 ${secondStr}초`;
    return durationTimeStr
  }

  getSucceededKillString(participant: any) {
    if (participant.stats.pentaKills !== 0) {
      return '펜타킬'
    } else if (participant.stats.quadraKills !== 0) {
      return '쿼드라킬'
    } else if (participant.stats.tripleKills !== 0) {
      return '트리플킬'
    } else if (participant.stats.doubleKills !== 0) {
      return '더블킬'
    } else {
      return ''
    }
  }
  getPerkUrl(participant: any, n: number) {
    if (n === 1) {
      const perkId = participant.stats.perkPrimaryStyle
      const perk = this.perks.find((element: any) => {
        return element.id === perkId
      })
      return perk.icon
    } else if (n === 2) {
      const perkId = participant.stats.perkSubStyle
      const perk = this.perks.find((element: any) => {
        return element.id === perkId
      })
      return perk.icon
    }
  }

  mounted() {
  }
}
</script>
<style scoped>
.font-size-small {
  font-size: 10px;
}
.matchinfo-area1 {
  max-width: 50px;
}
.matchinfo-area2 {
  max-width: 70px;
}
.matchinfo-area3 {
  max-width: 60px;
}
.matchinfo-area4 {
  max-width: 60px;
}
.matchinfo-area5 {
  max-width: 50px;
}
.matchinfo-area6 {
  max-width: 90px;
}
.matchinfo-area7 {
  max-width: 60px;
}
.matchinfo-area8 {
  max-width: 110px;
}
.matchinfo-area9 {
  max-width: 25px;
}
.requester-champ-icon {
  max-width: 50px;
  max-height: 50px;
}
.requester-spell-icon {
  max-width: 20px;
  max-height: 20px;
  border-radius: 5px;
}
.requester-perk-icon {
  max-width: 20px;
  max-height: 20px;
  border-radius: 5px;
}
.requester-item-icon {
  min-width: 20px;
  min-height: 20px;
  max-width: 20px;
  max-height: 20px;
  border-radius: 5px;
}
.participant-icon {
  max-width: 20px;
  max-height: 20px;
  border-radius: 3px;
}
</style>
