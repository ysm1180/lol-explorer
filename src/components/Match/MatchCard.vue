<template>
  <v-card
    :class="isAgain ? 'grey' : gameInfo.requester.isWin ? 'blue' : 'red'"
    class="lighten-5"
    flat
    height="100%"
  >
    <table class="match">
      <tbody class="body">
        <tr class="row">
          <td
            :class="
              isAgain ? 'grey' : gameInfo.requester.isWin ? 'blue' : 'red'
            "
            class="cell match-summary lighten-4"
          >
            <v-layout column fill-height justify-center>
              <span
                :class="
                  isAgain
                    ? 'grey--text'
                    : gameInfo.requester.isWin
                    ? 'blue--text'
                    : 'red--text'
                "
                class="match-title"
              >
                {{
                  isAgain
                    ? '다시하기'
                    : gameInfo.requester.isWin
                    ? '승리'
                    : '패배'
                }}
              </span>
              <span>
                {{ queueString }}
              </span>
              <span>{{ durationString }}</span>
              <tooltip :content="timestampToString" center>
                <span>{{ timeDeltaTextByNow }}</span>
              </tooltip>
            </v-layout>
          </td>
          <td class="cell">
            <champion-icon
              :championId="requester.championId"
              :level="requester.stats.champLevel"
              @click="
                () => {
                  $router.push(`/champion/${requester.championId}`);
                }
              "
              circle
              class="cursor__pointer"
            />
          </td>
          <td class="cell">
            <v-layout column fill-height justify-center>
              <div>
                <spell-icon :spellId="requester.spells[0]"></spell-icon>
                <spell-icon :spellId="requester.spells[1]"></spell-icon>
              </div>
              <div>
                <rune-icon
                  :runeId="requester.stats.perks[0]"
                  :runeStyleId="requester.stats.perkPrimaryStyle"
                  small
                />
                <rune-style-icon :runeStyleId="requester.stats.perkSubStyle" />
              </div>
            </v-layout>
          </td>
          <td class="cell kda">
            <v-layout column fill-height justify-center>
              <span class="font-weight-bold">
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
              <span class="font-size__small">
                {{ requester.stats.kills }} / {{ requester.stats.deaths }} /
                {{ requester.stats.assists }}
                <tooltip content="킬관여율" inline>
                  <span>
                    ({{
                      requesterTeam.totalKills === 0
                        ? 0
                        : (
                            ((requester.stats.kills + requester.stats.assists) *
                              100) /
                            requesterTeam.totalKills
                          ).toFixed(2)
                    }}%)
                  </span>
                </tooltip>
              </span>
              <span class="font-size__small green--text">
                {{ getSucceededKillString(requester) }}
              </span>
            </v-layout>
          </td>
          <td class="cell stats">
            <v-layout column fill-height justify-center>
              <span class="font-size__small font-weight-bold">
                골드 {{ requester.stats.goldEarned | gold }}
              </span>
              <span class="font-size__small">
                CS {{ requester.stats.totalMinionsKilled }}
              </span>
            </v-layout>
          </td>
          <td class="cell">
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
          </td>
          <td class="cell">
            <v-layout column fill-height justify-center>
              <div>
                <v-layout align-center justify-space-around mb-1>
                  <v-img
                    :class="{
                      mine: gameInfo.requester.participantId === Number(key),
                    }"
                    :src="champions[participant.championId] && champions[participant.championId].iconUrl"
                    class="participant-icon"
                    v-bind:key="key"
                    v-for="(participant, key) in gameInfo.teams['100']
                      .participants"
                  />
                </v-layout>
              </div>
              <div>
                <v-layout align-center justify-space-around>
                  <v-img
                    :class="{
                      mine: gameInfo.requester.participantId === Number(key),
                    }"
                    :src="champions[participant.championId] && champions[participant.championId].iconUrl"
                    class="participant-icon"
                    v-bind:key="key"
                    v-for="(participant, key) in gameInfo.teams['200']
                      .participants"
                  />
                </v-layout>
              </div>
            </v-layout>
          </td>
          <td @click="toggle()" class="cell cursor__pointer">
            <v-layout align-center fill-height>
              <v-icon v-if="!isToggle">expand_more</v-icon>
              <v-icon v-if="isToggle">expand_less</v-icon>
            </v-layout>
          </td>
        </tr>
      </tbody>
    </table>
    <v-flex v-if="isCreatedDetail" v-show="isToggle">
      <slot></slot>
    </v-flex>
  </v-card>
</template>

<script lang="ts">
import ChampionIcon from '@/components/Icon/ChampionIcon.vue';
import ItemIcon from '@/components/Icon/ItemIcon.vue';
import RuneIcon from '@/components/Icon/RuneIcon.vue';
import RuneStyleIcon from '@/components/Icon/RuneStyleIcon.vue';
import SpellIcon from '@/components/Icon/SpellIcon.vue';
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { MatchApiData } from '@/typings/match';
import { format } from 'util';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    RuneStyleIcon,
    RuneIcon,
    SpellIcon,
    Tooltip,
    ChampionIcon,
    ItemIcon,
  },
  filters: {
    gold(val: number) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
})
export default class MatchCard extends Vue {
  @Prop() public match!: MatchApiData;
  private isToggle: boolean = false;
  private isCreatedDetail: boolean = false;

  public created() {
    this.isToggle = false;
    this.isCreatedDetail = false;
  }

  public get isAgain() {
    return (
      this.match.gameInfo.gameDuration <= 240 &&
      !this.match.gameInfo.teams[100].firstBlood &&
      !this.match.gameInfo.teams[200].firstBlood
    );
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

  get requesterTeam() {
    const { teamId } = this.gameInfo.requester;
    return this.gameInfo.teams[teamId];
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

  get timestampToString() {
    return new Date(this.match.timestamp).toLocaleString();
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
    if (!this.isCreatedDetail) {
      this.isCreatedDetail = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.match {
  width: 100%;
  border-spacing: 0;

  .body {
    .row {
      .cell {
        padding: 5px;
        font-size: 12px;

        &.match-summary {
          width: 100px;
          font-size: 11px;

          .match-title {
            font-size: 13px;
            font-weight: bold;
          }
        }

        &.kda {
          width: 120px;
        }

        &.stats {
          width: 80px;
        }
      }
    }
  }
}

.requester-spell-icon {
  min-width: 24px;
  min-height: 24px;
  max-width: 24px;
  max-height: 24px;
}

.requester-perk-icon {
  min-width: 24px;
  min-height: 24px;
  max-width: 24px;
  max-height: 24px;
}

.participant-icon {
  min-width: 24px;
  min-height: 24px;
  max-width: 24px;
  max-height: 24px;
  border-radius: 3px;

  &.mine {
    border: 2px solid #ff8a65;
    box-sizing: content-box;
  }
}
</style>
