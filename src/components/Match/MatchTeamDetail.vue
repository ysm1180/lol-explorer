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
    <v-flex
      :class="requester.participantId === Number(key) ? 'orange lighten-2' : ''"
      class="participant-row"
      v-bind:key="key"
      v-for="(participant, key) in team.participants"
    >
      <v-layout fill-height justify-space-between>
        <v-flex class="participant-row-area1" fill-height>
          <v-layout align-center fill-height>
            <v-img
              :src="champions[participant.championId].iconUrl"
              class="champion-icon"
              style="position:relative"
            >
              <span
                class="white--text font-size-tiny"
                style="position:absolute;right:0;bottom:0;"
              >
                {{ participant.stats.champLevel }}
              </span>
            </v-img>
          </v-layout>
        </v-flex>
        <v-flex class="participant-row-area2" fill-height>
          <v-layout align-center fill-height>
            <div
              @click="toMatch(participant.player.accountId)"
              class="font-size-small pointer"
            >
              {{ participant.player.summonerName }}
            </div>
          </v-layout>
        </v-flex>
        <v-flex class="participant-row-area3" fill-height>
          <v-layout align-center fill-height>
            <span class="font-size-small">티어</span>
          </v-layout>
        </v-flex>
        <v-flex class="participant-row-area4" fill-height>
          <v-layout column fill-height justify-center>
            <span class="font-size-small font-weight-bold">
              평점
              {{
                (
                  (participant.stats.kills + participant.stats.assists) /
                  participant.stats.deaths
                ).toFixed(2)
              }}
            </span>
            <span class="font-size-small">
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
            </span>
          </v-layout>
        </v-flex>
        <v-flex class="participant-row-area5" fill-height>
          <v-layout column fill-height justify-center>
            <span class="font-size-small font-weight-bold">
              골드 {{ participant.stats.goldEarned | gold }}
            </span>
            <span class="font-size-small">
              CS
              {{
                participant.stats.totalMinionsKilled +
                  participant.stats.neutralMinionsKilled
              }}
            </span>
          </v-layout>
        </v-flex>
        <v-flex class="participant-row-area6" fill-height>
          <v-layout column fill-height justify-center>
            <span class="font-size-small">피해량</span>
            <span class="font-size-small">
              {{ participant.stats.totalDamageDealtToChampions }}
            </span>
          </v-layout>
        </v-flex>
        <v-flex class="participant-row-area7" fill-height>
          <v-layout column fill-height justify-center>
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
          </v-layout>
        </v-flex>
        <v-flex class="participant-row-area8" fill-height>
          <v-layout align-center fill-height>
            <item-icon
              :itemId="item"
              v-bind:key="index"
              v-for="(item, index) in participant.items"
            />
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IGameRequester, IGameTeam } from '@/typings/match';
import ItemIcon from '@/components/Icon/ItemIcon.vue';

@Component({
  components: {
    'item-icon': ItemIcon,
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
}
</script>

<style scoped>
.font-size-tiny {
  font-size: 9px;
}

.font-size-small {
  font-size: 11px;
  font-weight: normal;
}

.pointer {
  cursor: pointer;
}

.participant-row {
  padding: 5px;
}

.participant-row-area1 {
  max-width: 30px;
}

.participant-row-area2 {
  max-width: 80px;
}

.participant-row-area3 {
  max-width: 40px;
}

.participant-row-area4 {
  max-width: 90px;
}

.participant-row-area5 {
  max-width: 60px;
}

.participant-row-area6 {
  max-width: 50px;
}

.participant-row-area7 {
  max-width: 40px;
}

.participant-row-area8 {
  max-width: 150px;
}

.champion-icon {
  max-width: 32px;
  max-height: 32px;
}

.spell-icon {
  max-width: 12px;
  max-height: 12px;
  margin-right: 1px;
}

.perk-icon {
  max-width: 12px;
  max-height: 12px;
  margin-right: 1px;
}
</style>
