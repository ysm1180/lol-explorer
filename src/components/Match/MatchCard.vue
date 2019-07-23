<template>
  <v-card
    :class="gameInfo.requester.isWin ? 'blue' : 'red'"
    class="lighten-4"
    flat
    height="100%"
  >
    <v-layout justify-space-between>
      <v-flex class="matchinfo-area1">
        <v-img
          :src="champions[requester.championId].iconUrl"
          class="requester-champ-icon"
        ></v-img>
      </v-flex>
      <v-flex class="matchinfo-area2">
        <v-layout column fill-height justify-center>
          <span class="font-size-small font-weight-bold">
            {{ queueString }}
          </span>
          <span
            :class="gameInfo.requester.isWin ? 'blue--text' : 'red--text'"
            class="font-size-small"
          >
            {{ gameInfo.requester.isWin ? '승리' : '패배' }}
          </span>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area3">
        <v-layout column fill-height justify-center>
          <span class="font-size-small font-weight-bold">
            평점
            {{
              requester.stats.deaths > 0
                ? (
                    (requester.stats.kills + requester.stats.assists) /
                    requester.stats.deaths
                  ).toFixed(2)
                : 'Perfect'
            }}
          </span>
          <span class="caption">
            {{ requester.stats.kills }} / {{ requester.stats.deaths }} /
            {{ requester.stats.assists }}
          </span>
          <span class="font-size-small green--text">
            {{ getSucceededKillString(requester) }}
          </span>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area4">
        <v-layout column fill-height justify-center>
          <span class="font-size-small">
            레벨 {{ requester.stats.champLevel }}
          </span>
          <span class="font-size-small font-weight-bold">
            골드 {{ requester.stats.goldEarned | gold }}
          </span>
          <span class="font-size-small">
            CS {{ requester.stats.totalMinionsKilled }}
          </span>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area5">
        <v-layout column fill-height justify-center>
          <div>
            <v-layout>
              <v-img
                :src="
                  spells[requester.spells[0]]
                    ? spells[requester.spells[0]].iconUrl
                    : ''
                "
                class="requester-spell-icon"
              />
              <v-img
                :src="
                  spells[requester.spells[1]]
                    ? spells[requester.spells[1]].iconUrl
                    : ''
                "
                class="requester-spell-icon"
              />
            </v-layout>
          </div>
          <div>
            <v-layout>
              <v-img
                :src="
                  `${perks.baseIconUrl}${
                    perks[requester.stats.perkPrimaryStyle].icon
                  }`
                "
                class="requester-perk-icon"
              />
              <v-img
                :src="
                  `${perks.baseIconUrl}${
                    perks[requester.stats.perkSubStyle].icon
                  }`
                "
                class="requester-perk-icon"
              />
            </v-layout>
          </div>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area6">
        <v-layout align-baseline column fill-height justify-center>
          <div>
            <item-icon
              :itemId="item"
              v-bind:key="index"
              v-for="(item, index) in requester.items.slice(0, 3)"
            />
          </div>
          <div>
            <item-icon
              :itemId="item"
              v-bind:key="index"
              v-for="(item, index) in requester.items.slice(3, 7)"
            />
          </div>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area7">
        <v-layout column fill-height justify-center>
          <span class="font-size-small">{{ durationString }}</span>
          <span class="font-size-small">{{ timeDeltaTextByNow }}</span>
        </v-layout>
      </v-flex>
      <v-flex class="matchinfo-area8">
        <v-layout column fill-height justify-center>
          <div>
            <v-layout mb-1>
              <v-img
                :src="champions[participant.championId].iconUrl"
                class="participant-icon"
                v-bind:key="key"
                v-for="(participant, key) in gameInfo.teams['100'].participants"
              />
            </v-layout>
          </div>
          <div>
            <v-layout>
              <v-img
                :src="champions[participant.championId].iconUrl"
                class="participant-icon"
                v-bind:key="key"
                v-for="(participant, key) in gameInfo.teams['200'].participants"
              />
            </v-layout>
          </div>
        </v-layout>
      </v-flex>
      <v-flex @click="toggle()" class="matchinfo-area9 cursor__pointer">
        <v-layout align-center fill-height>
          <v-icon>expand_more</v-icon>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-flex v-if="isToggle">
      <slot></slot>
    </v-flex>
  </v-card>
</template>

<script lang="ts">
import { format } from 'util';
import { Component, Prop, Vue } from 'vue-property-decorator';
import ItemIcon from '@/components/Icon/ItemIcon.vue';

@Component({
  components: {
    ItemIcon,
  },
  filters: {
    gold(val: number) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
})
export default class MatchCard extends Vue {
  @Prop() public match: any;
  private isToggle: boolean = false;

  public created() {
    this.isToggle = false;
  }

  get champions() {
    return this.$store.state.lolstatic.champions;
  }

  get items() {
    return this.$store.state.lolstatic.items;
  }

  get spells() {
    return this.$store.state.lolstatic.spells;
  }

  get perks() {
    return this.$store.state.lolstatic.perks;
  }

  get gameInfo() {
    return this.match.gameInfo;
  }

  get requester() {
    const { participantId, teamId } = this.gameInfo.requester;
    return this.gameInfo.teams[teamId].participants[participantId];
  }

  get queueString() {
    let str = '';
    if (this.match.queue === 420) {
      str = '개인/2인 랭크';
    } else if (this.match.queue === 430) {
      str = '일반';
    } else if (this.match.queue === 440) {
      str = '자유 랭크';
    } else if (this.match.queue === 450) {
      str = '무작위 총력전';
    }
    return str;
  }

  get timeDeltaTextByNow() {
    const utcNow = new Date(new Date().toUTCString()).getTime();
    const sinceAfterSeconds = Math.floor(
      (utcNow - this.match.timestamp) / 1000
    );
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
    const { gameDuration } = this.match.gameInfo;
    const secondStr = format('%d', gameDuration % 60).padStart(2, '0');
    const minuteStr = format('%d', Math.floor(gameDuration / 60)).padStart(
      2,
      '0'
    );
    return `${minuteStr}분 ${secondStr}초`;
  }

  public getSucceededKillString(participant: any) {
    if (participant.stats.pentaKills !== 0) {
      return '펜타킬';
    } else if (participant.stats.quadraKills !== 0) {
      return '쿼드라킬';
    } else if (participant.stats.tripleKills !== 0) {
      return '트리플킬';
    } else if (participant.stats.doubleKills !== 0) {
      return '더블킬';
    } else {
      return '';
    }
  }

  public toggle() {
    this.isToggle = !this.isToggle;
  }

  public mounted() {}
}
</script>
<style scoped>
.font-size-small {
  font-size: 12px;
}

.matchinfo-area1 {
  max-width: 50px;
  padding: 5px;
}

.matchinfo-area2 {
  max-width: 70px;
}

.matchinfo-area3 {
  max-width: 70px;
}

.matchinfo-area4 {
  max-width: 80px;
}

.matchinfo-area5 {
  max-width: 50px;
}

.matchinfo-area6 {
  max-width: 95px;
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.requester-spell-icon {
  max-width: 23px;
  max-height: 23px;
}

.requester-perk-icon {
  max-width: 23px;
  max-height: 23px;
}

.participant-icon {
  max-width: 24px;
  max-height: 24px;
  border-radius: 3px;
}
</style>
