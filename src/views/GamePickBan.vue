<template>
  <v-layout fill-height justify-center>
    <v-layout align-center fill-height justify-center v-if="!champSelecting">
      <span class="display-1 font-weight-bold">
        게임 시작 상태가 아닙니다.
      </span>
    </v-layout>
    <v-layout
      fill-height
      id="game-start"
      justify-center
      v-else-if="myTeamData.length > 0"
    >
      <div class="mt-3">
        <div class="summoner-info-container">
          <div class="d-inline-block vertical__top">
            <table class="ally-summoner-table mr-2">
              <thead class="table__head">
                <tr class="table__row">
                  <th class="table__cell ally" colspan="3">아군 팀</th>
                  <th class="table__cell" colspan="2">랭크 통계</th>
                </tr>
              </thead>
              <tbody class="table__body">
                <tr
                  class="table__row"
                  v-bind:key="index"
                  v-for="(info, index) in myTeamData"
                >
                  <td class="table__cell">
                    <champion-icon
                      :borderColor="
                        lcuSummoner.summonerId === info.summonerId
                          ? '#FF8A65'
                          : '#49B4FF'
                      "
                      :championId="info.championId"
                      :position="info.assignedPosition"
                      circle
                      v-if="info.assignedPosition !== ''"
                    />
                    <champion-icon
                      :borderColor="
                        lcuSummoner.summonerId === info.summonerId
                          ? '#FF8A65'
                          : '#49B4FF'
                      "
                      :championId="info.championId"
                      circle
                      v-else
                    />
                  </td>
                  <td class="table__cell summoner-spell">
                    <spell-icon :spellId="info.spell1Id" />
                    <spell-icon :spellId="info.spell2Id" />
                  </td>
                  <td
                    class="table__cell"
                    colspan="3"
                    v-if="!myTeamSummonerInfos[info.summonerId]"
                  ></td>
                  <td
                    class="table__cell"
                    colspan="3"
                    v-if="
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
                    class="table__cell error"
                    colspan="3"
                    v-if="
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
                    class="table__cell summoner-name"
                    v-if="
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
                    class="table__cell"
                    v-if="
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
                    class="table__cell"
                    v-if="
                      myTeamSummonerInfos[info.summonerId] &&
                        !myTeamSummonerInfos[info.summonerId].loading &&
                        !myTeamSummonerInfos[info.summonerId].error
                    "
                  >
                    <div
                      v-if="
                        myTeamSummonerInfos[info.summonerId] &&
                          myTeamSummonerInfos[info.summonerId].summoner &&
                          myTeamSummonerInfos[info.summonerId].summoner.season
                      "
                    >
                      <div class="game-win">
                        {{
                          toPercentage(
                            myTeamSummonerInfos[info.summonerId].summoner.season
                              .wins,
                            myTeamSummonerInfos[info.summonerId].summoner.season
                              .wins +
                              myTeamSummonerInfos[info.summonerId].summoner
                                .season.losses
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
                    <div v-else>
                      <div class="game-win">
                        -
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="d-inline-block vertical__top">
            <table class="enemy-summoner-table mr-2">
              <thead class="table__head">
                <tr class="table__row">
                  <th class="table__cell enemy" colspan="2">적군 팀</th>
                </tr>
              </thead>
              <tbody class="table__body">
                <tr
                  class="table__row"
                  v-bind:key="index"
                  v-for="(info, index) in enemyTeamData"
                >
                  <td
                    class="table__cell summoner-name"
                    v-if="info.championId === 0"
                  >
                    소환사 {{ index + 1 }}
                  </td>
                  <td class="table__cell summoner-name" v-else>
                    {{
                      champions[info.championId] &&
                        champions[info.championId].name
                    }}
                  </td>
                  <td class="table__cell">
                    <champion-icon
                      :championId="info.championId"
                      borderColor="#F75556"
                      circle
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <v-layout
          align-center
          class="my-3 picked-champion-container"
          column
          justify-center
          v-if="pickedChampion"
        >
          <v-flex class="mb-3">
            <v-layout>
              <div class="d-inline-block mr-3">
                <v-layout align-center class="mb-3" justify-center>
                  <div class="d-inline-block">
                    <champion-icon :championId="pickedChampion.key" circle />
                  </div>

                  <div class="d-inline-block picked-champion-name">
                    {{ pickedChampion.name }}
                  </div>
                </v-layout>
                <div>
                  <position-icon
                    :disabled="isDisablePosition(name)"
                    :position="name"
                    :selected="selectedPosition === POSITION_ID[name]"
                    :tooltip="
                      !isDisablePosition(name)
                        ? `승률 : ${toPercentage(
                            pickedChampionPositionData[name].win,
                            pickedChampionPositionData[name].count
                          )}%`
                        : '데이터 부족'
                    "
                    @click="selectPosition(POSITION_ID[name])"
                    class="mx-1"
                    v-for="name in POSITION_NAME.slice(1)"
                  />
                </div>
              </div>
              <div class="d-inline-block" v-if="selectedPosition !== 0">
                <table class="recommend-table">
                  <thead class="table__head">
                    <tr class="table__row">
                      <th></th>
                      <th class="table__cell">
                        사용 빈도
                      </th>
                      <th class="table__cell">승률</th>
                      <th class="table__cell">사용자 설정</th>
                    </tr>
                  </thead>
                  <tbody class="table__body">
                    <tr class="table__row">
                      <td class="table__cell">아이템</td>
                    </tr>
                    <tr class="table__row">
                      <td class="table__cell">스펠</td>
                      <td class="table__cell">
                        <hover-button
                          :data="
                            recommendSetting[POSITION_NAME[selectedPosition]] &&
                              recommendSetting[POSITION_NAME[selectedPosition]]
                                .spells &&
                              recommendSetting[POSITION_NAME[selectedPosition]]
                                .spells.frequency
                          "
                        />
                      </td>
                      <td class="table__cell seletable">
                        <hover-button
                          :data="
                            recommendSetting[POSITION_NAME[selectedPosition]] &&
                              recommendSetting[POSITION_NAME[selectedPosition]]
                                .spells &&
                              recommendSetting[POSITION_NAME[selectedPosition]]
                                .spells.win
                          "
                        />
                      </td>
                    </tr>
                    <tr class="table__row">
                      <td class="table__cell">룬</td>
                      <td class="table__cell seletable">
                        <hover-button
                          :data="
                            recommendSetting[POSITION_NAME[selectedPosition]] &&
                              recommendSetting[POSITION_NAME[selectedPosition]]
                                .runes &&
                              recommendSetting[POSITION_NAME[selectedPosition]]
                                .runes.frequency
                          "
                        />
                      </td>
                      <td class="table__cell seletable">
                        <hover-button
                          :data="
                            recommendSetting[POSITION_NAME[selectedPosition]] &&
                              recommendSetting[POSITION_NAME[selectedPosition]]
                                .runes &&
                              recommendSetting[POSITION_NAME[selectedPosition]]
                                .runes.win
                          "
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--            <div class="mt-5" v-else>-->
              <!--              <v-progress-circular-->
              <!--                color="deep-orange lighten-2"-->
              <!--                indeterminate-->
              <!--                size="24"-->
              <!--              />-->
              <!--            </div>-->
            </v-layout>
          </v-flex>

          <v-flex v-if="selectedRecommendRune">
            <div class="d-inline-block">
              <spell-icon :spellId="selectedRecommendSpell.spells[0]" large />
              <spell-icon :spellId="selectedRecommendSpell.spells[1]" large />
            </div>
            <rune-book
              :primaryRuneStyle="selectedRecommendRune.mainRuneStyle"
              :primaryRunes="selectedRecommendRune.mainRunes"
              :secondaryRuneStyle="selectedRecommendRune.subRuneStyle"
              :secondaryRunes="selectedRecommendRune.subRunes"
              :statRunes="selectedRecommendRune.statRunes"
              containerWidth="200"
              hover
              large
              pointer
              v-if="selectedRecommendRune"
            />
          </v-flex>
        </v-layout>
      </div>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import { toPercentage } from '@/base/math';
import { QUEUE_TYPE, QUEUE_TYPE_STRING } from '@/common/constants';
import HoverButton from '@/components/Game/HoverButton.vue';
import ChampionIcon from '@/components/Icon/ChampionIcon.vue';
import PositionIcon from '@/components/Icon/PositionIcon.vue';
import RuneIcon from '@/components/Icon/RuneIcon.vue';
import RuneStyleIcon from '@/components/Icon/RuneStyleIcon.vue';
import SpellIcon from '@/components/Icon/SpellIcon.vue';
import RuneBook from '@/components/Rune/RuneBook.vue';
import { END_POINT } from '@/config';
import { StaticChampions } from '@/store/modules/lolstatic';
import { MatchApiData } from '@/typings/match';
import { StaticChampionApiData } from '@/typings/static-data';
import { SummonerSeasonApiData } from '@/typings/summoner';
import axios from 'axios';
import { ipcRenderer } from 'electron';
import { LcuSummonerData } from 'models';
import { Component, Vue, Watch } from 'vue-property-decorator';

interface RecommendRuneApiData {
  count: number;
  win: number;
  mainRuneStyle: string;
  subRuneStyle: string;
  mainRunes: string[];
  subRunes: string[];
  statRunes: string[];
}

interface RecommendSpellApiData {
  count: number;
  win: number;
  spells: number[];
}

interface TeamLcuData {
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

interface RunePageLcuData {
  id: number;
  isEditable: boolean;
}

interface PositionSetting {
  runes: {
    frequency: RecommendRuneApiData;
    win: RecommendRuneApiData;
  };
  spells: {
    frequency: RecommendSpellApiData;
    win: RecommendSpellApiData;
  };
}

const LCU_POSITION: { [position: string]: number } = {
  TOP: 1,
  JUNGLE: 2,
  MIDDLE: 3,
  BOTTOM: 4,
  UTILITY: 5,
};

@Component({
  components: {
    HoverButton,
    RuneBook,
    RuneStyleIcon,
    RuneIcon,
    PositionIcon,
    SpellIcon,
    ChampionIcon,
  },
})
export default class GamePickBan extends Vue {
  private lcuListener?: (event: any, data: any) => void;
  private champSelecting: boolean = false;
  private searchData?: {
    queueType: string;
    state: string;
    seconds: number;
    estimatedQueueTime: number;
  };
  private gameQueueId: number = 420;
  private myTeamData: TeamLcuData[] = [];
  private enemyTeamData: TeamLcuData[] = [];
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
  private pickedChampion: StaticChampionApiData | null = null;
  private pickedChampionPositionData: {
    [position: string]: { count: number; win: number };
  } = {};
  private selectedPosition: number = 0;
  private recommendSetting: {
    [position: string]: PositionSetting;
  } = {};
  private selectedRecommendRuneType: 'frequency' | 'win' = 'frequency';
  private selectedRecommendSpellType: 'frequency' | 'win' = 'frequency';
  private editableRunePageIds: number[] = [];
  private hover = false;

  private readonly POSITION_NAME = [
    'unknown',
    'top',
    'jungle',
    'mid',
    'adc',
    'support',
  ];
  private readonly POSITION_ID: { [position: string]: number } = {
    top: 1,
    jungle: 2,
    mid: 3,
    adc: 4,
    support: 5,
  };

  @Watch('myTeamData')
  public async getMyTeamInfo(current: TeamLcuData[], prev: TeamLcuData[]) {
    if (prev && current) {
      const currentSummoners = current.map((summoner) => summoner.summonerId);
      const prevSummoners = prev.map((summoner) => summoner.summonerId);
      if (JSON.stringify(currentSummoners) !== JSON.stringify(prevSummoners)) {
        await this.loadTeamSummonerInfos(this.myTeamData);
      }

      if (JSON.stringify(prev) !== JSON.stringify(current)) {
        const pickedChampion = await this.getPickedChampion();
        if (
          (!this.pickedChampion && pickedChampion) ||
          (this.pickedChampion &&
            pickedChampion &&
            this.pickedChampion.key !== pickedChampion.key)
        ) {
          await this.selectPosition(0);
          this.pickedChampion = pickedChampion;
          this.pickedChampionPositionData = await this.getPickedChampionPositionData();
          this.recommendSetting = {};
          const mostPosition = await this.getPickedChampionMostPosition();
          console.log(mostPosition, this.pickedChampionPositionData);
          if (!this.isDisablePosition(this.POSITION_NAME[mostPosition])) {
            await this.selectPosition(mostPosition, true);
          }
        } else if (this.pickedChampion && !pickedChampion) {
          this.pickedChampion = pickedChampion;
          this.pickedChampionPositionData = {};
          this.recommendSetting = {};
          await this.selectPosition(0);
        }
      }
    } else if (prev.length === 0) {
      this.myTeamSummonerInfos = {};
    }
  }

  public get selectedRecommendSpell() {
    if (
      this.recommendSetting[this.POSITION_NAME[this.selectedPosition]] &&
      this.recommendSetting[this.POSITION_NAME[this.selectedPosition]].spells &&
      this.recommendSetting[this.POSITION_NAME[this.selectedPosition]].spells[
        this.selectedRecommendSpellType
      ]
    ) {
      return this.recommendSetting[this.POSITION_NAME[this.selectedPosition]]
        .spells[this.selectedRecommendSpellType];
    } else {
      return null;
    }
  }

  public get selectedRecommendRune() {
    if (
      this.recommendSetting[this.POSITION_NAME[this.selectedPosition]] &&
      this.recommendSetting[this.POSITION_NAME[this.selectedPosition]].runes &&
      this.recommendSetting[this.POSITION_NAME[this.selectedPosition]].runes[
        this.selectedRecommendRuneType
      ]
    ) {
      return this.recommendSetting[this.POSITION_NAME[this.selectedPosition]]
        .runes[this.selectedRecommendRuneType];
    } else {
      return null;
    }
  }

  public get lcuSummoner(): LcuSummonerData {
    return this.$store.state.connection.lcuSummoner;
  }

  public created() {
    this.myTeamData = [];
    this.myTeamSummonerInfos = {};
    this.gameQueueId = 420;

    this.lcuListener = async (event: any, data: any) => {
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
        if (!this.champSelecting) {
          this.myTeamData = [];
          this.enemyTeamData = [];
        }

        const sessionData = await this.getGameSession();
        if (sessionData && sessionData.gameData.queue.id !== -1) {
          this.gameQueueId = sessionData.gameData.queue.id;
        }
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
      } else if (
        data.uri === '/lol-perks/v1/pages' &&
        data.eventType === 'Update'
      ) {
        const runePages: RunePageLcuData[] = data.data;
        this.editableRunePageIds = runePages
          .filter((page) => page.isEditable)
          .map((page) => page.id);
      }
    };

    ipcRenderer.on('lcu-api-message', this.lcuListener);
  }

  public async mounted() {
    this.myTeamData = [];
    this.myTeamSummonerInfos = {};

    this.init();
  }

  public async getPickedChampion() {
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

  public isDisablePosition(position: string) {
    return (
      !this.pickedChampionPositionData[position] ||
      this.pickedChampionPositionData[position].count < 10
    );
  }

  public async getPickedChampionPositionData() {
    if (this.pickedChampion) {
      try {
        const response = await axios.get(
          `${END_POINT}/statistics/champion/positions/${
            this.pickedChampion.key
          }`
        );
        const data: Array<{ _id: number; count: number; win: number }> =
          response.data;
        const result: {
          [position: string]: { count: number; win: number };
        } = {};
        data.forEach((position) => {
          result[this.POSITION_NAME[position._id]] = {
            count: position.count,
            win: position.win,
          };
        });
        return result;
      } catch (err) {
        console.error('[getPickedChampionPositionData]', err);
        return {};
      }
    } else {
      return {};
    }
  }

  public async getPickedChampionMostPosition() {
    if (this.pickedChampion) {
      const requester = this.myTeamData.find(
        (data) => data.summonerId === this.lcuSummoner.summonerId
      );

      if (requester && requester.assignedPosition !== '') {
        const requesterPosition = LCU_POSITION[requester.assignedPosition];
        if (!this.isDisablePosition(this.POSITION_NAME[requesterPosition])) {
          return LCU_POSITION[requester.assignedPosition];
        }
      }

      try {
        const response = await axios.get(
          `${END_POINT}/statistics/champion/positions/${
            this.pickedChampion.key
          }`
        );
        const data: Array<{ _id: number }> = response.data;
        return data[0]._id;
      } catch (err) {
        console.error(
          '[getPickedChampionMostPosition]',
          err,
          this.pickedChampion
        );
        return 0;
      }
    }

    return 0;
  }

  public async init() {
    if (this.lcuData) {
      this.champSelecting = await this.isChampSelecting();
      if (this.champSelecting) {
        const sessionData = await this.getGameSession();
        if (sessionData && sessionData.gameData.queue.id !== -1) {
          this.gameQueueId = sessionData.gameData.queue.id;
        }

        const champData = await this.getLcuChampSelectSession();
        this.myTeamData = champData.myTeam;
        this.enemyTeamData = champData.theirTeam;
      }

      const runePages = await this.getRunePages();
      this.editableRunePageIds = runePages
        .filter((page) => page.isEditable)
        .map((page) => page.id);
    }
  }

  public beforeDestroy() {
    if (this.lcuListener) {
      ipcRenderer.removeListener('lcu-api-message', this.lcuListener);
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
    try {
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

      return response.data as LcuGameSessionData;
    } catch (err) {
      console.error('getGameSession', err, this.lcuData);
      return null;
    }
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
      console.error('[getLcuChampSelectSession]', err, this.lcuData);
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
        console.error('[loadSummonerInfo]', err);

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

  public async loadTeamSummonerInfos(teamData: TeamLcuData[]) {
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
      let gameQueueId = this.gameQueueId;
      if (
        this.gameQueueId !== QUEUE_TYPE.RANKED_SOLO_5x5 &&
        this.gameQueueId !== QUEUE_TYPE.RANKED_FLEX_SR
      ) {
        gameQueueId = QUEUE_TYPE.RANKED_SOLO_5x5;
      }
      let season = data.seasons.find(
        (season: SummonerSeasonApiData) =>
          season.queueType === QUEUE_TYPE_STRING[gameQueueId]
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
      return 'UNRANKED';
    }
  }

  public async getUnrankedMatchInfo(accountId: number) {
    try {
      let gameQueueId = this.gameQueueId;
      if (
        this.gameQueueId !== QUEUE_TYPE.RANKED_SOLO_5x5 &&
        this.gameQueueId !== QUEUE_TYPE.RANKED_FLEX_SR
      ) {
        gameQueueId = QUEUE_TYPE.RANKED_SOLO_5x5;
      }
      const response = await axios.get(
        `${END_POINT}/summoner/matches/unranked/${accountId}/${gameQueueId}`
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
      console.error('[getUnrankedMatchInfo]', err);
      return null;
    }
  }

  public async getRecommedSetting(): Promise<PositionSetting | null> {
    if (this.pickedChampion) {
      try {
        const response = await axios.get(
          `${END_POINT}/statistics/champion/recommend/${
            this.pickedChampion.key
          }/${this.selectedPosition}`
        );
        const data = response.data as PositionSetting;
        let rune = data.runes.frequency;
        const runeFrequency: RecommendRuneApiData = {
          mainRuneStyle: rune.mainRuneStyle.toString(),
          subRuneStyle: rune.subRuneStyle.toString(),
          mainRunes: rune.mainRunes.map((slot) => slot.toString()),
          subRunes: rune.subRunes.map((slot) => slot.toString()),
          statRunes: rune.statRunes.map((slot) => slot.toString()),
          count: rune.count,
          win: rune.win,
        };

        rune = data.runes.win;
        const runeWin: RecommendRuneApiData = {
          mainRuneStyle: rune.mainRuneStyle.toString(),
          subRuneStyle: rune.subRuneStyle.toString(),
          mainRunes: rune.mainRunes.map((slot) => slot.toString()),
          subRunes: rune.subRunes.map((slot) => slot.toString()),
          statRunes: rune.statRunes.map((slot) => slot.toString()),
          count: rune.count,
          win: rune.win,
        };

        return {
          runes: { frequency: runeFrequency, win: runeWin },
          spells: { frequency: data.spells.frequency, win: data.spells.win },
        };
      } catch (err) {
        console.error('[getRecommedRunes]', err);
        return null;
      }
    } else {
      return null;
    }
  }

  public async getRunePages() {
    try {
      const url = `${this.lcuData.protocol}://${this.lcuData.address}:${
        this.lcuData.port
      }/lol-perks/v1/pages`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${btoa(
            `${this.lcuData.username}:${this.lcuData.password}`
          )}`,
        },
      });

      return response.data as RunePageLcuData[];
    } catch (err) {
      return [];
    }
  }

  public async selectPosition(position: number, isForce: boolean = false) {
    if (isForce || this.selectedPosition !== position) {
      this.selectedPosition = position;

      if (this.selectedPosition !== 0) {
        if (!this.recommendSetting[this.POSITION_NAME[this.selectedPosition]]) {
          const result = await this.getRecommedSetting();
          if (!result) {
            this.$set(
              this.recommendSetting,
              this.POSITION_NAME[this.selectedPosition],
              {
                runes: null,
                spells: null,
              }
            );
          } else {
            this.$set(
              this.recommendSetting,
              this.POSITION_NAME[this.selectedPosition],
              result
            );
            this.selectedRecommendRuneType = 'frequency';
          }
        }
      }
    }
  }

  public toPercentage(molecular: number, denominator: number) {
    return toPercentage(molecular, denominator);
  }

  public get lcuData() {
    return this.$store.state.connection.lcuData;
  }

  public get champions() {
    return this.$store.state.lolstatic.champions as StaticChampions;
  }
}
</script>

<style lang="scss" scoped>
#game-start {
  overflow-y: auto;
}

.summoner-info-container {
  border-left: 5px solid #ff8a65;
  background-color: #343f57;
  padding: 20px;
  font-size: 13px;

  .ally-summoner-table {
    border-spacing: 0 10px;
    border-radius: 5px;

    .table__head {
      .table__row {
        .table__cell {
          padding: 5px 10px;
          color: white;

          &.ally {
            text-align: left;
            color: #5da8e5;
          }
        }
      }
    }

    .table__body {
      background-color: white;

      .table__row {
        .table__cell {
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

    .table__head {
      .table__row {
        .table__cell {
          padding: 5px 10px;

          &.enemy {
            text-align: right;
            color: #ff5859;
          }
        }
      }
    }

    .table__body {
      background-color: white;

      .table__row {
        .table__cell {
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

.recommend-table {
  border-spacing: 0;
  color: white;

  .table__head {
    .table__row {
      .table__cell {
        border-bottom: 2px solid #e57c5b;
        font-size: 13px;
        padding: 10px 5px;
      }
    }
  }

  .table__body {
    .table__row {
      .table__cell {
        font-size: 12px;
        width: 150px;
      }
    }
  }
}

.picked-champion-container {
  border-left: 5px solid #ff8a65;
  background-color: #343f57;
  padding: 20px;

  .picked-champion-name {
    margin-left: 10px;
    font-size: 13px;
    font-weight: bold;
    color: white;
  }
}

.rune-list {
  margin: 10px 0;
  color: #333333;
  border-radius: 10px;

  .rune-title {
    font-weight: bold;
    border-bottom: 2px solid #aaaaaa;
    padding: 10px;
    color: white;
  }

  .rune-item {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #333333;
    color: white;

    &:hover {
      background-color: #424650;
    }

    &.selected {
      background-color: #e57c5b;
    }

    .sub-text {
      font-size: 11px;
      color: #dddddd;
    }
  }
}
</style>
