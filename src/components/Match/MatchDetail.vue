<template>
  <v-card flat>
    <v-layout column>
      <v-layout column lighten-5 :class="gameInfo.teams['100'].isWin?'blue':'red'">
        <v-flex text-xs-left pa-2>
          <span class="mr-3" :class="gameInfo.teams['100'].isWin?'blue--text':'red--text'">블루팀({{gameInfo.teams['100'].isWin?'승리':'패배'}})</span>
          <span class="font-weight-bold mr-4">{{gameInfo.teams['100'].totalKills}} / {{gameInfo.teams['100'].totalDeaths}} / {{gameInfo.teams['100'].totalAssists}}</span>
          <span class="font-size-small mr-2">바론: {{gameInfo.teams['100'].baronKills}}</span>
          <span class="font-size-small mr-4">용: {{gameInfo.teams['100'].dragonKills}}</span>
        </v-flex>
        <v-flex v-for="(participant, key) in gameInfo.teams['100'].participants" v-bind:key="key" class="participant-row">
          <v-layout fill-height justify-space-between>
            <v-flex class="participant-row-area1" fill-height>
              <v-layout fill-height align-center>
                <v-img class="champion-icon" :src="champions[participant.championId].iconUrl" style="position:relative">
                  <span class="white--text font-size-very-small" style="position:absolute;right:0;bottom:0;">{{participant.stats.champLevel}}</span>
                </v-img>
              </v-layout>
            </v-flex>
            <v-flex class="participant-row-area2" fill-height>
              <v-layout fill-height align-center>
                <span class="font-size-small pointer" @click="toMatch(participant.player.accountId)">{{participant.player.summonerName}}</span>
              </v-layout>
            </v-flex>
            <v-flex class="participant-row-area3" fill-height>
              <v-layout fill-height align-center>
                <span class="font-size-small">티어</span>
              </v-layout>
            </v-flex>
            <v-flex class="participant-row-area4" fill-height>
              <v-layout column fill-height justify-center>
                <span class="font-size-small font-weight-bold">평점 {{((participant.stats.kills + participant.stats.assists) / participant.stats.deaths).toFixed(2)}}</span>
                <span class="font-size-small">{{participant.stats.kills}}/{{participant.stats.deaths}}/{{participant.stats.assists}} ({{((participant.stats.kills + participant.stats.assists) * 100 / gameInfo.teams['100'].totalKills).toFixed(2)}}%)</span>
              </v-layout>
            </v-flex>
            <v-flex class="participant-row-area5" fill-height>
              <v-layout column fill-height justify-center>
                <span class="font-size-small font-weight-bold">골드 {{participant.stats.goldEarned | gold}}</span>
                <span class="font-size-small">CS {{participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled}}</span>
              </v-layout>
            </v-flex>
            <v-flex class="participant-row-area6" fill-height>
              <v-layout column fill-height justify-center>
                <span class="font-size-small">피해량 </span>
                <span class="font-size-small">{{participant.stats.totalDamageDealtToChampions}}</span>
              </v-layout>
            </v-flex>
            <v-flex class="participant-row-area7" fill-height>
              <v-layout fill-height column justify-center>
                <div>
                  <v-layout>
                    <v-img :src="spells[participant.spells[0]].iconUrl" class="spell-icon" />
                    <v-img :src="spells[participant.spells[1]].iconUrl" class="spell-icon" />
                  </v-layout>
                </div>
                <div>
                  <v-layout>
                    <v-img :src="`https://ddragon.leagueoflegends.com/cdn/img/${getPerkUrl(participant, 1)}`" class="perk-icon" />
                    <v-img :src="`https://ddragon.leagueoflegends.com/cdn/img/${getPerkUrl(participant, 2)}`" class="perk-icon" />
                  </v-layout>
                </div>
              </v-layout>
            </v-flex>
            <v-flex class="participant-row-area8" fill-height>
              <v-layout fill-height align-center>
                <v-img v-for="(item, index) in participant.items" v-bind:key="index" :src="item!==0?items[item].iconUrl:''" class="item-icon grey lighten-1" />
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-layout column red lighten-5 :class="gameInfo.teams['200'].isWin?'blue':'red'">
        <v-flex text-xs-left pa-2>
          <span class="mr-3" :class="gameInfo.teams['200'].isWin?'blue--text':'red--text'">레드팀({{gameInfo.teams['200'].isWin?'승리':'패배'}})</span>
          <span class="font-weight-bold mr-4">{{gameInfo.teams['200'].totalKills}} / {{gameInfo.teams['200'].totalDeaths}} / {{gameInfo.teams['200'].totalAssists}}</span>
          <span class="font-size-small mr-2">바론: {{gameInfo.teams['200'].baronKills}}</span>
          <span class="font-size-small mr-4">용: {{gameInfo.teams['200'].dragonKills}}</span>
        </v-flex>
        <v-flex v-for="(participant, key) in gameInfo.teams['200'].participants" v-bind:key="key" class="participant-row">
          <v-layout fill-height justify-space-between>
            <v-flex class="participant-row-area1" fill-height>
              <v-layout fill-height align-center>
                <v-img class="champion-icon" :src="champions[participant.championId].iconUrl" style="position:relative">
                  <span class="white--text font-size-very-small" style="position:absolute;right:0;bottom:0;">{{participant.stats.champLevel}}</span>
                </v-img>
              </v-layout>
            </v-flex>
            <v-flex class="participant-row-area2" fill-height>
              <v-layout fill-height align-center>
                <span class="font-size-small pointer" @click="toMatch(participant.player.accountId)">{{participant.player.summonerName}}</span>
              </v-layout>
            </v-flex>
            <v-flex class="participant-row-area3" fill-height>
              <v-layout fill-height align-center>
                <span class="font-size-small">티어</span>
              </v-layout>
            </v-flex>
            <v-flex class="participant-row-area4" fill-height>
              <v-layout column fill-height justify-center>
                <span class="font-size-small font-weight-bold">평점 {{((participant.stats.kills + participant.stats.assists) / participant.stats.deaths).toFixed(2)}}</span>
                <span class="font-size-small">{{participant.stats.kills}}/{{participant.stats.deaths}}/{{participant.stats.assists}} ({{((participant.stats.kills + participant.stats.assists) * 100 / gameInfo.teams['200'].totalKills).toFixed(2)}}%)</span>
              </v-layout>
            </v-flex>
            <v-flex class="participant-row-area5" fill-height>
              <v-layout column fill-height justify-center>
                <span class="font-size-small font-weight-bold">골드 {{participant.stats.goldEarned | gold}}</span>
                <span class="font-size-small">CS {{participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled}}</span>
              </v-layout>
            </v-flex>
            <v-flex class="participant-row-area6" fill-height>
              <v-layout column fill-height justify-center>
                <span class="font-size-small">피해량 </span>
                <span class="font-size-small">{{participant.stats.totalDamageDealtToChampions}}</span>
              </v-layout>
            </v-flex>
            <v-flex class="participant-row-area7" fill-height>
              <v-layout fill-height column justify-center>
                <div>
                  <v-layout>
                    <v-img :src="spells[participant.spells[0]].iconUrl" class="spell-icon" />
                    <v-img :src="spells[participant.spells[1]].iconUrl" class="spell-icon" />
                  </v-layout>
                </div>
                <div>
                  <v-layout>
                    <v-img :src="`https://ddragon.leagueoflegends.com/cdn/img/${getPerkUrl(participant, 1)}`" class="perk-icon" />
                    <v-img :src="`https://ddragon.leagueoflegends.com/cdn/img/${getPerkUrl(participant, 2)}`" class="perk-icon" />
                  </v-layout>
                </div>
              </v-layout>
            </v-flex>
            <v-flex class="participant-row-area8" fill-height>
              <v-layout fill-height align-center>
                <v-img v-for="(item, index) in participant.items" v-bind:key="index" :src="item!==0?items[item].iconUrl:''" class="item-icon grey lighten-1" />
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
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
    gold(val: number) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  }
})
export default class MatchDetail extends Vue {
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

  toMatch(accountId: string) {
    this.$router.push(`/match/${accountId}`)
  }

  mounted() {
  }
}
</script>
<style scoped>
.font-size-very-small {
  font-size: 8px;
}
.font-size-small {
  font-size: 10px;
}
.pointer {
  cursor: pointer;
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
  max-width: 80px;
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
.participant-row{
  height: 30px;
}
.champion-icon{
  max-width: 25px;
  max-height: 25px;
}
.item-icon{
  min-width: 20px;
  min-height: 20px;
  max-width: 20px;
  max-height: 20px;
  margin-right: 1px;
}
.spell-icon{
  max-width: 12px;
  max-height: 12px;
  margin-right: 1px;
}
.perk-icon{
  max-width: 12px;
  max-height: 12px;
  margin-right: 1px;
}
</style>
