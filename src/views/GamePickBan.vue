<template>
  <v-layout fill-height justify-center>
    <v-layout align-center fill-height justify-center v-if="!champSelecting">
      <span class="display-1 font-weight-bold">
        게임 시작 상태가 아닙니다.
      </span>
    </v-layout>
    <div class="mt-2" v-else>
      <div class="summoner-info-container">
        <div class="d-inline-block vertical__top">
          <table class="ally-summoner-table mr-2">
            <thead class="head">
              <tr class="row">
                <th class="cell ally" colspan="3">아군 팀</th>
                <th class="cell" colspan="2">랭크 통계</th>
              </tr>
            </thead>
            <tbody class="content">
              <tr
                class="row"
                v-bind:key="index"
                v-for="(info, index) in myTeamData"
              >
                <td class="cell">
                  <champion-icon :championId="info.championId" circle />
                </td>
                <td class="cell summoner-spell">
                  <spell-icon :spellId="info.spell1Id" />
                  <spell-icon :spellId="info.spell2Id" />
                </td>
                <td
                  class="cell"
                  colspan="3"
                  v-show="!myTeamSummonerInfos[info.summonerId]"
                ></td>
                <td
                  class="cell"
                  colspan="3"
                  v-show="
                    myTeamSummonerInfos[info.summonerId] &&
                      myTeamSummonerInfos[info.summonerId].loading &&
                      !myTeamSummonerInfos[info.summonerId].error
                  "
                >
                  <v-progress-circular
                    color="deep-orange lighten-2"
                    indeterminate
                    size="16"
                  />
                </td>
                <td
                  class="cell error"
                  colspan="3"
                  v-show="
                    myTeamSummonerInfos[info.summonerId] &&
                      !!myTeamSummonerInfos[info.summonerId].error
                  "
                >
                  <span>정보를 불러오는 데에 문제가 발생하였습니다.</span>
                  <v-btn
                    @click="loadSummonerInfo(info.summonerId)"
                    flat
                    icon
                    title="다시 불러오기"
                  >
                    <v-icon>autorenew</v-icon>
                  </v-btn>
                </td>
                <td
                  class="cell summoner-name"
                  v-show="
                    myTeamSummonerInfos[info.summonerId] &&
                      !myTeamSummonerInfos[info.summonerId].loading &&
                      !myTeamSummonerInfos[info.summonerId].error
                  "
                >
                  {{
                    myTeamSummonerInfos[info.summonerId] &&
                      myTeamSummonerInfos[info.summonerId].summoner &&
                      myTeamSummonerInfos[info.summonerId].summoner.name
                  }}
                </td>
                <td
                  class="cell"
                  v-show="
                    myTeamSummonerInfos[info.summonerId] &&
                      !myTeamSummonerInfos[info.summonerId].loading &&
                      !myTeamSummonerInfos[info.summonerId].error
                  "
                >
                  <div
                    v-if="
                      myTeamSummonerInfos[info.summonerId] &&
                        myTeamSummonerInfos[info.summonerId].summoner
                    "
                  >
                    <v-img
                      :src="`/assets/emblems/${getTier(info.summonerId)}.png`"
                      style="width:30px; height:30px; margin: 0 auto;"
                    />
                    <div class="summoner-tier">
                      {{ getTierRank(info.summonerId) }}
                    </div>
                  </div>
                </td>
                <td
                  class="cell"
                  v-show="
                    myTeamSummonerInfos[info.summonerId] &&
                      !myTeamSummonerInfos[info.summonerId].loading &&
                      !myTeamSummonerInfos[info.summonerId].error
                  "
                >
                  <div
                    v-if="
                      myTeamSummonerInfos[info.summonerId] &&
                        myTeamSummonerInfos[info.summonerId].summoner
                    "
                  >
                    <div class="game-win">
                      {{
                        toPercentage(
                          myTeamSummonerInfos[info.summonerId].summoner.season
                            .wins,
                          myTeamSummonerInfos[info.summonerId].summoner.season
                            .wins +
                            myTeamSummonerInfos[info.summonerId].summoner.season
                              .losses
                        )
                      }}
                      %
                    </div>
                    <div class="game-count">
                      {{
                        myTeamSummonerInfos[info.summonerId].summoner.season
                          .wins +
                          myTeamSummonerInfos[info.summonerId].summoner.season
                            .losses
                      }}
                      게임
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-inline-block vertical__top">
          <table class="enemy-summoner-table mr-2">
            <thead class="head">
              <tr class="row">
                <th class="cell enemy" colspan="2">적군 팀</th>
              </tr>
            </thead>
            <tbody class="content">
              <tr
                class="row"
                v-bind:key="index"
                v-for="(info, index) in enemyTeamData"
              >
                <td class="cell summoner-name" v-show="info.championId === 0">
                  소환사 {{ index + 1 }}
                </td>
                <td class="cell summoner-name" v-show="info.championId !== 0">
                  {{
                    champions[info.championId] &&
                      champions[info.championId].name
                  }}
                </td>
                <td class="cell">
                  <champion-icon :championId="info.championId" circle />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-3" v-if="pickedChampion">
        <div class="d-inline-block">
          <div>
            <champion-icon :championId="pickedChampion.key" circle />
            <span>{{ pickedChampion.name }}</span>
          </div>
          <div>
            <position-icon position="top" />
            <position-icon position="jungle" />
            <position-icon position="mid" />
            <position-icon position="adc" />
            <position-icon position="support" />
          </div>
          <div>

          </div>
        </div>

        <div class="d-inline-block">
          <rune-book />
        </div>
      </div>
    </div>
  </v-layout>
</template>

<script lang="ts">
import { toPercentage } from '@/base/math';
import { QUEUE_TYPE_STRING } from '@/common/constants';
import ChampionIcon from '@/components/Icon/ChampionIcon.vue';
import PositionIcon from '@/components/Icon/PositionIcon.vue';
import RuneIcon from '@/components/Icon/RuneIcon.vue';
import RuneStyleIcon from '@/components/Icon/RuneStyleIcon.vue';
import SpellIcon from '@/components/Icon/SpellIcon.vue';
import RuneBook from '@/components/Rune/RuneBook.vue';
import { END_POINT } from '@/config';
import { MatchApiData } from '@/typings/match';
import { SummonerSeasonApiData } from '@/typings/summoner';
import axios from 'axios';
import { ipcRenderer } from 'electron';
import { LcuSummonerData } from 'models';
import { Component, Vue, Watch } from 'vue-property-decorator';

interface ITeamData {
  assignedPosition: string;
  cellId: number;
  championId: number;
  championPickIntent: number;
  entitledFeatureType: string;
  playerType: string;
  selectedSkinId: number;
  spell1Id: number;
  spell2Id: number;
  summonerId: number;
  team: number;
  wardSkinId: number;
}

@Component({
  components: {
    RuneBook,
    RuneStyleIcon,
    RuneIcon,
    PositionIcon,
    SpellIcon,
    ChampionIcon,
  },
})
export default class GamePickBan extends Vue {
  private champSelecting: boolean = false;
  private searchData?: {
    queueType: string;
    state: string;
    seconds: number;
    estimatedQueueTime: number;
  };
  private gameQueueId: number = 420;
  private myTeamData: ITeamData[] = [];
  private enemyTeamData: ITeamData[] = [];
  private myTeamSummonerInfos: {
    [id: string]: {
      loading: boolean;
      error?: boolean;
      summoner?: {
        name: string;
        season: SummonerSeasonApiData;
      };
    };
  } = {};

  @Watch('myTeamData')
  public async getMyTeamInfo(current: ITeamData[], prev: ITeamData[]) {
    if (prev && current) {
      const currentSummoners = current.map((summoner) => summoner.summonerId);
      const prevSummoners = prev.map((summoner) => summoner.summonerId);
      if (JSON.stringify(currentSummoners) !== JSON.stringify(prevSummoners)) {
        await this.loadTeamSummonerInfos(this.myTeamData);
      }
    }
  }

  public get lcuSummoner(): LcuSummonerData {
    return this.$store.state.connection.lcuSummoner;
  }

  public get pickedChampion() {
    if (this.myTeamData && this.myTeamData.length > 0) {
      const requester = this.myTeamData.find(
        (data) => data.summonerId === this.lcuSummoner.summonerId
      );
      if (requester) {
        return this.champions[requester.championId] || null;
      }
    }

    return null;
  }

  public created() {
    this.myTeamData = [];
    this.myTeamSummonerInfos = {};
    this.gameQueueId = 420;

    const listener = async (event: any, data: any) => {
      if (
        data.uri === '/lol-champ-select/v1/session' &&
        data.eventType === 'Update'
      ) {
        this.myTeamData = data.data.myTeam;
        this.enemyTeamData = data.data.theirTeam;
      } else if (
        data.uri === '/lol-gameflow/v1/gameflow-phase' &&
        data.eventType === 'Update'
      ) {
        this.champSelecting = data.data === 'ChampSelect';
        const sessionData = await this.getGameSession();
        this.gameQueueId = sessionData.queue.id;
      } else if (
        data.uri === '/lol-matchmaking/v1/search' &&
        data.eventType === 'Update'
      ) {
        const searchLcuData = data.data;
        let queueType = '';
        if (searchLcuData.queueId === 420) {
          queueType = '솔로 랭크';
        } else if (searchLcuData.queueId === 430) {
          queueType = '일반 게임';
        } else if (searchLcuData.queueId === 440) {
          queueType = '자유 랭크';
        }

        this.searchData = {
          queueType,
          state: searchLcuData.searchState,
          seconds: searchLcuData.timeInQueue,
          estimatedQueueTime: searchLcuData.estimatedQueueTime,
        };
      } else if (
        data.uri === '/lol-matchmaking/v1/search' &&
        data.eventType === 'Delete'
      ) {
        this.searchData = undefined;
      }
    };

    ipcRenderer.on('lcu-api-message', listener);
  }

  public async mounted() {
    this.myTeamData = [];
    this.myTeamSummonerInfos = {};

    this.init();
  }

  public async init() {
    if (this.lcuData) {
      this.champSelecting = await this.isChampSelecting();
      if (this.champSelecting) {
        const champData = await this.getLcuChampSelectSession();
        this.myTeamData = champData.myTeam;
        this.enemyTeamData = champData.theirTeam;
      }
    }
  }

  public async isChampSelecting() {
    const url = `${this.lcuData.protocol}://${this.lcuData.address}:${
      this.lcuData.port
    }/lol-gameflow/v1/gameflow-phase`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${btoa(
          `${this.lcuData.username}:${this.lcuData.password}`
        )}`,
      },
    });

    return response.data === 'ChampSelect';
  }

  public async getGameSession() {
    const url = `${this.lcuData.protocol}://${this.lcuData.address}:${
      this.lcuData.port
    }/lol-gameflow/v1/session`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${btoa(
          `${this.lcuData.username}:${this.lcuData.password}`
        )}`,
      },
    });

    return response.data;
  }

  public async getLcuChampSelectSession() {
    try {
      const response = await axios.get(
        `${this.lcuData.protocol}://${this.lcuData.address}:${
          this.lcuData.port
        }/lol-champ-select/v1/session`,
        {
          headers: {
            Authorization: `Basic ${btoa(
              `${this.lcuData.username}:${this.lcuData.password}`
            )}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      return [];
    }
  }

  private loadSummonerInfo(summonerId: number) {
    this.$set(this.myTeamSummonerInfos, summonerId, {
      loading: true,
    });

    const baseUrl = `${this.lcuData.protocol}://${this.lcuData.address}:${
      this.lcuData.port
    }`;

    axios
      .get(`${baseUrl}/lol-summoner/v1/summoners/${summonerId}`, {
        headers: {
          Authorization: `Basic ${btoa(
            `${this.lcuData.username}:${this.lcuData.password}`
          )}`,
        },
      })
      .then((response) => {
        return this.loadSummonerInfoByName(
          summonerId,
          response.data.displayName
        );
      })
      .then((result) => {
        this.$set(this.myTeamSummonerInfos[summonerId], 'summoner', result);
        this.$set(this.myTeamSummonerInfos[summonerId], 'loading', false);
        this.$set(this.myTeamSummonerInfos[summonerId], 'error', false);
      })
      .catch((err) => {
        console.error(err);

        this.$set(this.myTeamSummonerInfos[summonerId], 'summoner', undefined);
        this.$set(this.myTeamSummonerInfos[summonerId], 'loading', false);
        this.$set(this.myTeamSummonerInfos[summonerId], 'error', true);
      })
      .finally(() => {
        this.$set(
          this.myTeamSummonerInfos,
          summonerId,
          this.myTeamSummonerInfos[summonerId]
        );
      });
  }

  public async loadTeamSummonerInfos(teamData: ITeamData[]) {
    for (const summoner of teamData) {
      if (summoner.summonerId !== 0) {
        if (!this.myTeamSummonerInfos[summoner.summonerId]) {
          this.loadSummonerInfo(summoner.summonerId);
        }
      }
    }
  }

  public async loadSummonerInfoByName(id: number, name: string) {
    return axios.get(`${END_POINT}/summoner/${name}`).then(async (response) => {
      const data = response.data;
      let season = data.seasons.find(
        (season: SummonerSeasonApiData) =>
          season.queueType === QUEUE_TYPE_STRING[this.gameQueueId]
      );
      if (!season) {
        season = await this.getUnrankedMatchInfo(data.accountId);
      }
      return {
        name: data.name,
        season,
      };
    });
  }

  public getTier(summonerId: number) {
    if (
      this.myTeamSummonerInfos[summonerId] &&
      this.myTeamSummonerInfos[summonerId].summoner
    ) {
      const summoner = this.myTeamSummonerInfos[summonerId].summoner!;
      if (summoner.season) {
        return summoner.season.tier;
      } else {
        return 'unranked';
      }
    } else {
      return 'unranked';
    }
  }

  public getTierRank(summonerId: number) {
    if (
      this.myTeamSummonerInfos[summonerId] &&
      this.myTeamSummonerInfos[summonerId].summoner
    ) {
      const summoner = this.myTeamSummonerInfos[summonerId].summoner!;
      if (summoner.season) {
        if (
          summoner.season.tier === 'MASTER' ||
          summoner.season.tier === 'GRANDMASTER' ||
          summoner.season.tier === 'CHALLENGER'
        ) {
          return summoner.season.tier;
        } else {
          return `${summoner.season.tier} ${summoner.season.rank}`;
        }
      } else {
        return 'UNRANKED';
      }
    } else {
      return 'UNKNOWN';
    }
  }

  public async getUnrankedMatchInfo(accountId: number) {
    try {
      const response = await axios.get(
        `${END_POINT}/summoner/matches/unranked/${accountId}/${
          this.gameQueueId
        }`
      );
      const matches: MatchApiData[] = response.data;
      const matchCount = matches.length;
      const winCount = matches.filter((match) => match.gameInfo.requester.isWin)
        .length;

      const result = {
        tier: 'UNRANKED',
        rank: '',
        queueType: QUEUE_TYPE_STRING[this.gameQueueId],
        leaguePoints: 0,
        wins: winCount,
        losses: matchCount - winCount,
      };
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public toPercentage(molecular: number, denominator: number) {
    return toPercentage(molecular, denominator);
  }

  public get lcuData() {
    return this.$store.state.connection.lcuData;
  }

  public get champions() {
    return this.$store.state.lolstatic.champions;
  }
}
</script>

<style lang="scss" scoped>
.summoner-info-container {
  border: 1px solid rgba(#ff8a65, 0.3);
  padding: 20px;
  border-radius: 10px;

  .ally-summoner-table {
    border-spacing: 0 10px;
    border-radius: 5px;

    .head {
      .row {
        .cell {
          padding: 5px 10px;

          &.ally {
            text-align: left;
            color: #4b88b9;
          }
        }
      }
    }

    .content {
      background-color: white;

      .row {
        .cell {
          padding: 10px;
          background-color: #e3f2fd;

          &:first-child {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
          }

          &:last-child {
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
          }

          &.summoner-name {
            font-weight: bold;
            text-align: left;
            width: 250px;
          }

          &.summoner-spell {
            padding-left: 0;
            padding-right: 0;
          }

          .summoner-tier {
            font-size: 10px;
            font-weight: bold;
          }

          .game-win {
            font-weight: bold;
          }

          .game-count {
            color: #666;
            font-weight: normal;
            font-size: 11px;
          }

          &.error {
            font-size: 13px;
            font-weight: bold;
            color: #ff5859;
          }
        }
      }
    }
  }

  .enemy-summoner-table {
    border-spacing: 0 10px;

    .head {
      .row {
        .cell {
          padding: 5px 10px;

          &.enemy {
            text-align: right;
            color: #ff5859;
          }
        }
      }
    }

    .content {
      background-color: white;

      .row {
        .cell {
          padding: 10px;
          background-color: #ffebee;

          &:first-child {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
          }

          &:last-child {
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
          }

          &.summoner-name {
            font-weight: bold;
            text-align: right;
            width: 100px;
          }
        }
      }
    }
  }
}
</style>
