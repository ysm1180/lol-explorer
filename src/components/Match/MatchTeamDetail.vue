<template>
  <v-layout :class="team.isWin ? 'blue' : 'red'" column lighten-5>
    <v-flex pa-2 text-xs-left>
      <span :class="team.isWin ? 'blue--text' : 'red--text'" class="mr-3">
        {{ teamName }}팀 ({{ team.isWin ? '승리' : '패배' }})
      </span>
      <span class="font-weight-bold mr-4">
        {{ team.totalKills }} / {{ team.totalDeaths }} /
        {{ team.totalAssists }}
      </span>
      <span class="font-size__small mr-2">바론: {{ team.baronKills }}</span>
      <span class="font-size__small mr-4">용: {{ team.dragonKills }}</span>
    </v-flex>
    <table class="participant-detail">
      <tbody class="body">
        <tr
          :class="requester.participantId === Number(key) ? 'mine' : ''"
          class="row"
          v-bind:key="key"
          v-for="(participant, key) in team.participants"
        >
          <td class="cell">
            <champion-icon
              :championId="participant.championId"
              :level="participant.stats.champLevel"
              small
            />
          </td>
          <td class="cell">
            <div>
              <spell-icon :spellId="participant.spells[0]" small />
              <spell-icon :spellId="participant.spells[1]" small />
            </div>
            <div>
              <rune-icon
                :runeId="participant.stats.perks[0]"
                :runeStyleId="participant.stats.perkPrimaryStyle"
                tiny
              />
              <rune-style-icon
                :runeStyleId="participant.stats.perkSubStyle"
                small
              />
            </div>
          </td>
          <td class="cell summoner-tier">
            <div
              class="font-weight-bold"
              v-if="summonerTiers[key] !== undefined"
            >
              {{ summonerTiers[key] }}
            </div>
            <div v-else>
              <v-progress-circular
                color="deep-orange lighten-2"
                indeterminate
                size="16"
              />
            </div>
          </td>
          <td class="cell summoner-name">
            <div
              @click="toMatch(participant.player.accountId)"
              class="font-size__small cursor__pointer"
            >
              {{ participant.player.summonerName }}
            </div>
          </td>
          <td class="cell">
            <div class="font-size__small font-weight-bold">
              평점
              {{
                participant.stats.deaths > 0
                  ? (
                      (participant.stats.kills + participant.stats.assists) /
                      participant.stats.deaths
                    ).toFixed(2)
                  : 'Perfect'
              }}
            </div>
            <span class="font-size__small">
              {{ participant.stats.kills }} / {{ participant.stats.deaths }} /
              {{ participant.stats.assists }}
              <tooltip content="킬관여율" inline>
                <span>
                  ({{
                    team.totalKills === 0
                      ? 0
                      : (
                          ((participant.stats.kills +
                            participant.stats.assists) *
                            100) /
                          team.totalKills
                        ).toFixed(2)
                  }}%)
                </span>
              </tooltip>
            </span>
          </td>
          <td class="cell">
            <div class="font-size__small font-weight-bold">
              골드 {{ participant.stats.goldEarned | gold }}
            </div>
            <div class="font-size__small">
              CS
              {{
                participant.stats.totalMinionsKilled +
                  participant.stats.neutralMinionsKilled
              }}
            </div>
          </td>
          <td class="cell damage">
            <tooltip content="챔피언에게 가한 데미지" fullWidth>
              <v-progress-linear
                :value="
                  Math.floor(
                    (participant.stats.totalDamageDealtToChampions /
                      maxDamage) *
                      100
                  )
                "
                class="margin__none"
                color="pink"
                height="15"
              >
                <div class="progress-text">
                  {{ participant.stats.totalDamageDealtToChampions }}
                </div>
              </v-progress-linear>
            </tooltip>
          </td>

          <td class="cell">
            <item-icon
              :itemId="item"
              v-bind:key="index"
              v-for="(item, index) in participant.items"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </v-layout>
</template>

<script lang="ts">
import ChampionIcon from '@/components/Icon/ChampionIcon.vue';
import ItemIcon from '@/components/Icon/ItemIcon.vue';
import RuneIcon from '@/components/Icon/RuneIcon.vue';
import RuneStyleIcon from '@/components/Icon/RuneStyleIcon.vue';
import SpellIcon from '@/components/Icon/SpellIcon.vue';
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { END_POINT } from '@/config';
import { IGameRequester, IGameTeam } from '@/typings/match';
import { ISummonerApiData } from '@/typings/summoner';
import axios from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

enum QUEUE_TYPE {
  RANKED_SOLO_5x5 = 420,
  RANKED_FLEX_SR = 440,
}

@Component({
  components: {
    RuneIcon,
    RuneStyleIcon,
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
export default class MatchTeamDetail extends Vue {
  @Prop() private queue!: number;
  @Prop() private team!: IGameTeam;
  @Prop() private requester!: IGameRequester;
  @Prop() private teamName!: string;
  private summonerTiers: { [id: string]: string } = {};
  private maxDamage: number = 0;

  get champions() {
    return this.$store.state.lolstatic.champions;
  }

  get items() {
    return this.$store.state.lolstatic.items;
  }

  get spells() {
    return this.$store.state.lolstatic.spells;
  }

  public toMatch(accountId: string) {
    this.$router.push(`/match/${accountId}`);
  }

  public mounted() {
    this.maxDamage = 0;

    for (const key in this.team.participants) {
      if (this.team.participants.hasOwnProperty(key)) {
        const participant = this.team.participants[key];
        axios
          .get<ISummonerApiData>(
            `${END_POINT}/summoner/byAccount/${participant.player.accountId}`
          )
          .then(({ data }) => {
            let queueType = '';
            if (this.queue === QUEUE_TYPE.RANKED_SOLO_5x5) {
              queueType = 'RANKED_SOLO_5x5';
            } else if (this.queue === QUEUE_TYPE.RANKED_FLEX_SR) {
              queueType = 'RANKED_FLEX_SR';
            }

            const rank = data.seasons.find(
              (season) => season.queueType === queueType
            );
            if (rank) {
              this.$set(
                this.summonerTiers,
                key,
                `${rank.tier} ${this.romanToNumber(rank.rank)}`
              );
            } else {
              this.$set(this.summonerTiers, key, 'Unranked');
            }
          })
          .catch((err) => {
            console.log(err);
          });

        if (this.maxDamage < participant.stats.totalDamageDealtToChampions) {
          this.maxDamage = participant.stats.totalDamageDealtToChampions;
        }
      }
    }
  }

  private romanToNumber(romanNumber: string) {
    if (romanNumber === 'I') {
      return 1;
    } else if (romanNumber === 'II') {
      return 2;
    } else if (romanNumber === 'III') {
      return 3;
    } else if (romanNumber === 'IV') {
      return 4;
    } else if (romanNumber === 'V') {
      return 5;
    }

    return 0;
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
}
</script>

<style lang="scss" scoped>
.participant-detail {
  border-spacing: 0;

  .body {
    .row {
      &.mine {
        background-image: linear-gradient(to right, #ff8a65, white);
      }

      .cell {
        padding: 2px;

        &.summoner-name {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;

          width: 100px;
        }

        &.summoner-tier {
          font-size: 10px;

          width: 70px;
        }

        &.damage {
          width: 100px;
          padding: 2px 10px;
        }
      }
    }
  }
}

.progress-text {
  font-size: 9px;
  line-height: 15px;
  font-weight: normal;
  color: white;
  vertical-align: middle;
  user-select: none;
}

.spell-icon {
  min-width: 16px;
  min-height: 16px;
  max-width: 16px;
  max-height: 16px;
}

.perk-icon {
  min-width: 16px;
  min-height: 16px;
  max-width: 16px;
  max-height: 16px;
}
</style>
