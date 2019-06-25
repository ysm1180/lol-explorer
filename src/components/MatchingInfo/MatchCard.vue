<template>
  <v-card flat height="100%" class="lighten-3" :class="requesterIsWin?'blue':'red'">
    <v-layout fill-height justify-space-between>
      <v-flex fill-height class="matchinfo-area1" py-3>
        <v-layout column fill-height>
          <v-flex font-weight-bold caption>{{queueString}}</v-flex>
          <v-flex caption>{{timeDeltaTextByNow}}</v-flex>
          <v-flex font-weight-bold caption :class="requesterIsWin?'blue--text':'red--text'">{{requesterIsWin?'승리':'패배'}}</v-flex>
          <v-flex caption>{{durationString}}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex fill-height class="matchinfo-area2" py-3>
        <v-layout column fill-height>
          <v-flex xs8>
            <v-layout>
              <v-flex xs6>
                <v-img :src="champions[requesterParticipant.championId].iconUrl" class="requester-champ-icon" />
              </v-flex>
              <v-flex xs6>
                <v-layout fill-height row wrap>
                  <v-img :src="spells[requesterParticipant.spell1Id].iconUrl" class="requester-spell-icon" />
                  <v-img :src="`https://ddragon.leagueoflegends.com/cdn/img/${requesterPerk1.icon}`" class="requester-perk-icon" />
                  <v-img :src="spells[requesterParticipant.spell2Id].iconUrl" class="requester-spell-icon" />
                  <v-img :src="`https://ddragon.leagueoflegends.com/cdn/img/${requesterPerk2.icon}`" class="requester-perk-icon" />
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs4 grey--text text--darken-2 caption font-weight-bold>
            {{champions[requesterParticipant.championId].name}}
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex fill-height class="matchinfo-area3" py-3>
        <v-layout column fill-height justify-center>
          <v-flex xs4 subheading font-weight-bold>
            {{requesterParticipant.stats.kills}} / <span class="red--text">{{requesterParticipant.stats.deaths}}</span> / {{requesterParticipant.stats.assists}}
          </v-flex>
          <v-flex xs4>
            <span class="font-weight-bold">{{((requesterParticipant.stats.kills + requesterParticipant.stats.assists) / requesterParticipant.stats.deaths).toFixed(2)}}</span> 평점
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex fill-height class="matchinfo-area4" py-3>
        <v-layout column fill-height justify-center>
          <v-flex xs3 caption>레벨 {{requesterParticipant.stats.champLevel}}</v-flex>
          <v-flex xs3 caption>{{requesterParticipant.stats.totalMinionsKilled}} CS</v-flex>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area5" mr-1>
        <v-layout row wrap my-4>
          <v-flex v-for="item in requesterParticipant.stats.items" v-bind:key="item" class="requester-item-icon">
            <v-img v-if="item!==0" :src="items[item].iconUrl" />
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area6">
        <v-layout fill-height>
          <v-flex xs6>
            <v-layout column fill-height>
              <v-flex v-for="(participant, index) in match.gameInfo.participants.slice(0,5)" v-bind:key="index">
                <v-layout>
                  <v-img :src="champions[participant.championId].iconUrl" class="participant-icon mr-1" />
                  <span class="summoner-name">{{match.gameInfo.participantIdentities[index].player.summonerName}}</span>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs6>
            <v-layout column fill-height>
              <v-flex v-for="(participant, index) in match.gameInfo.participants.slice(5,10)" v-bind:key="index">
                <v-layout>
                  <v-img :src="champions[participant.championId].iconUrl" class="participant-icon mr-1" />
                  <span class="summoner-name">{{match.gameInfo.participantIdentities[index+5].player.summonerName | summonerNameFilter}}</span>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
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
  filters: {
    summonerNameFilter(val: string) {
      if(val.length > 10) {
        return `${val.slice(0, 10)}...`
      } else {
        return val
      }
    }
  }
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

  get queueString() {
    let str = ''
    if (this.match.queue === 420) {
      str = '개인/2인 랭크'
    } else if (this.match.queue === 430) {
      str = '일반'
    } else if (this.match.queue === 440) {
      str = '자유 랭크 게임'
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

  get requesterParticipantId() {
    const { participantIdentities } = this.match.gameInfo
    const requesterParticipantIdentity = participantIdentities.find((element: any) => {
      return element.player.accountId === this.match.summonerAccountId
    })
    return requesterParticipantIdentity.participantId
  }

  get requesterTeamId() {
    const { participants } = this.match.gameInfo
    const participant = participants.find((element: any) => {
      return element.participantId === this.requesterParticipantId
    })
    return participant.teamId
  }

  get requesterIsWin() {
    const { teams } = this.match.gameInfo
    const team = teams.find((element: any) => {
      return element.teamId === this.requesterTeamId
    })
    return team.win === 'Win'
  }

  get requesterParticipant() {
    const { participants } = this.match.gameInfo
    const participant = participants.find((element: any) => {
      return element.participantId === this.requesterParticipantId
    })
    return participant
  }

  get requesterPerk1() {
    const perkId = this.requesterParticipant.stats.perkPrimaryStyle
    const perk = this.perks.find((element: any) => {
      return element.id === perkId
    })
    return perk
  }

  get requesterPerk2() {
    const perkId = this.requesterParticipant.stats.perkSubStyle
    const perk = this.perks.find((element: any) => {
      return element.id === perkId
    })
    return perk
  }

  mounted() {
  }
}
</script>
<style scoped>
.matchinfo-area1 {
  max-width: 90px;
}
.matchinfo-area2 {
  max-width: 105px;
}
.matchinfo-area3 {
  max-width: 75px;
}
.matchinfo-area4 {
  max-width: 50px;
}
.matchinfo-area5 {
  max-width: 100px;
}
.matchinfo-area6 {
  max-width: 200px;
}
.requester-champ-icon {
  max-width: 50px;
  max-height: 50px;
  border-radius: 50%;
}
.requester-spell-icon {
  width: 25px;
  height: 25px;
  border-radius: 5px;
}
.requester-perk-icon {
  width: 25px;
  height: 25px;
  border-radius: 5px;
}
.requester-item-icon {
  min-width: 25px;
  min-height: 25px;
  max-width: 25px;
  max-height: 25px;
  border-radius: 5px;
}
.participant-icon {
  max-width: 20px;
  max-height: 20px;
  border-radius: 3px;
}
.summoner-name {
  font-size: 10px;
  width: 60px;
}
</style>
