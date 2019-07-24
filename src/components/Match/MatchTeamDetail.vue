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
      <span class="font-size-small mr-2">바론: {{ team.baronKills }}</span>
      <span class="font-size-small mr-4">용: {{ team.dragonKills }}</span>
    </v-flex>
    <table class="participant-detail">
      <tbody class="body">
        <tr
          :class="
            requester.participantId === Number(key) ? 'orange lighten-2' : ''
          "
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
          <td class="cell summoner-tier">
            <div v-if="summonerTiers[key] !== undefined">
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
              class="font-size-small pointer"
            >
              {{ participant.player.summonerName }}
            </div>
          </td>
          <td class="cell">
            <div class="font-size-small font-weight-bold">
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
            <div class="font-size-small">
              {{ participant.stats.kills }}/{{ participant.stats.deaths }}/{{
                participant.stats.assists
              }}
              ({{
                (
                  ((participant.stats.kills + participant.stats.assists) *
                    100) /
                  team.totalKills
                ).toFixed(2)
              }}%)
            </div>
          </td>
          <td class="cell">
            <div class="font-size-small font-weight-bold">
              골드 {{ participant.stats.goldEarned | gold }}
            </div>
            <div class="font-size-small">
              CS
              {{
                participant.stats.totalMinionsKilled +
                  participant.stats.neutralMinionsKilled
              }}
            </div>
          </td>
          <td class="cell damage">
            <div>
              <v-progress-linear
                color="pink"
                height="10"
                :value="
                  participant.stats.totalDamageDealtToChampions / maxDamage * 100
                "
              >
                <span class="progress-text">
                  {{ participant.stats.totalDamageDealtToChampions }}
                </span>
              </v-progress-linear>
            </div>
          </td>
          <td class="cell">
            <div>
              <v-layout>
                <v-img
                  :src="
                    spells[participant.spells[0]]
                      ? spells[participant.spells[0]].iconUrl
                      : ''
                  "
                  class="spell-icon"
                />
                <v-img
                  :src="
                    spells[participant.spells[1]]
                      ? spells[participant.spells[1]].iconUrl
                      : ''
                  "
                  class="spell-icon"
                />
              </v-layout>
            </div>
            <div>
              <v-layout>
                <v-img
                  :src="
                    `${perks.baseIconUrl}${
                      perks[participant.stats.perkPrimaryStyle].icon
                    }`
                  "
                  class="perk-icon"
                />
                <v-img
                  :src="
                    `${perks.baseIconUrl}${
                      perks[participant.stats.perkSubStyle].icon
                    }`
                  "
                  class="perk-icon"
                />
              </v-layout>
            </div>
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
import { END_POINT } from '@/config';
import { IGameRequester, IGameTeam } from '@/typings/match';
import { ISummonerApiData } from '@/typings/summoner';
import axios from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
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

  get perks() {
    return this.$store.state.lolstatic.perks;
  }

  public toMatch(accountId: string) {
    this.$router.push(`/match/${accountId}`);
  }

  public mounted() {
    this.maxDamage = 0;

    for (const key in this.team.participants) {
      const participant = this.team.participants[key];
      axios
        .get<ISummonerApiData>(
          `${END_POINT}/summoner/byAccount/${participant.player.accountId}`
        )
        .then(({ data }) => {
          const soloRank = data.seasons.find(
            (season) => season.queueType === 'RANKED_SOLO_5x5'
          );
          if (soloRank) {
            this.$set(
              this.summonerTiers,
              key,
              `${soloRank.tier} ${this.romanToNumber(soloRank.rank)}`
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
}
</script>

<style lang="scss" scoped>
.participant-detail {
  border-spacing: 0;

  .body {
    .row {
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
  font-size: 10px;
  font-weight: normal;
  color: white;
  vertical-align: top;
}

.font-size-small {
  font-size: 11px;
  font-weight: normal;
}

.pointer {
  cursor: pointer;
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
