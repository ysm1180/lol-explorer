<template>
  <v-layout fill-height justify-center>
    <v-layout align-center column id="champion-info" mt-3>
      <div class="champion-info-container">
        <div class="d-inline-block">
          <champion-icon :championId="Number(championId)" extralarge />
        </div>
        <div class="px-4 mb-4 d-inline-block">
          <div class="mb-3 champion-name">
            {{ champions[championId].name }}
          </div>
          <div>
            <champion-passive-icon :championId="championId" class="mr-1" />
            <champion-spell-icon
              :championId="championId"
              class="mr-1"
              spellName="Q"
            />
            <champion-spell-icon
              :championId="championId"
              class="mr-1"
              spellName="W"
            />
            <champion-spell-icon
              :championId="championId"
              class="mr-1"
              spellName="E"
            />
            <champion-spell-icon :championId="championId" spellName="R" />
          </div>
        </div>

        <div class="positions">
          <position
            :count="this.counts['top']"
            :selected="selectedPosition === 'top'"
            :totalCount="totalCount"
            :win="this.wins['top']"
            @click="clickPosition('top')"
            name="탑"
            position="top"
          />

          <position
            :count="this.counts['jungle']"
            :selected="selectedPosition === 'jungle'"
            :totalCount="totalCount"
            :win="this.wins['jungle']"
            @click="clickPosition('jungle')"
            name="정글"
            position="jungle"
          />

          <position
            :count="this.counts['mid']"
            :selected="selectedPosition === 'mid'"
            :totalCount="totalCount"
            :win="this.wins['mid']"
            @click="clickPosition('mid')"
            name="미드"
            position="mid"
          />

          <position
            :count="this.counts['adc']"
            :selected="selectedPosition === 'adc'"
            :totalCount="totalCount"
            :win="this.wins['adc']"
            @click="clickPosition('adc')"
            name="원딜"
            position="adc"
          />

          <position
            :count="this.counts['support']"
            :selected="selectedPosition === 'support'"
            :totalCount="totalCount"
            :win="this.wins['support']"
            @click="clickPosition('support')"
            name="서포터"
            position="support"
          />
        </div>

        <div>
          <tabs>
            <tab :selected="true" name="종합">
              <div class="mt-3" v-if="selectedPositionData">
                <div class="d-inline-block vertical__top mr-2">
                  <table
                    class="data-table"
                    v-if="
                      selectedPositionData.spells &&
                        selectedPositionData.spells.length > 0
                    "
                  >
                    <thead class="table-title">
                      <tr>
                        <th>소환사 주문</th>
                        <th>픽률</th>
                        <th>승률</th>
                      </tr>
                    </thead>
                    <tbody class="table-content">
                      <tr
                        v-bind:key="i"
                        v-for="(n, i) in selectedPositionData.spells.length"
                      >
                        <td>
                          <spell-icon
                            :spellId="selectedPositionData.spells[i].id1"
                            class="mr-1"
                            large
                          />
                          <spell-icon
                            :spellId="selectedPositionData.spells[i].id2"
                            large
                          />
                        </td>
                        <td>{{ selectedPositionData.spells[i].pickRate }}%</td>
                        <td>{{ selectedPositionData.spells[i].winRate }}%</td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="data-table" v-else>
                    <thead class="table-title">
                      <tr>
                        <th>소환사 주문</th>
                        <th>픽률</th>
                        <th>승률</th>
                      </tr>
                    </thead>
                    <tbody class="table-content">
                      <tr>
                        <td class="data-none" colspan="3">
                          소환사 주문 통계 데이터가 없습니다.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="divider" style="height: 135px;"></div>

                <div class="d-inline-block vertical__top">
                  <table
                    class="data-table pl-2"
                    v-if="
                      selectedPositionData.startItems &&
                        selectedPositionData.startItems.length > 0
                    "
                  >
                    <thead class="table-title">
                      <tr>
                        <th>시작 아이템</th>
                        <th>픽률</th>
                        <th>승률</th>
                      </tr>
                    </thead>
                    <tbody class="table-content">
                      <tr
                        v-bind:key="i"
                        v-for="(n, i) in selectedPositionData.startItems.length"
                      >
                        <td>
                          <item-icon
                            :itemId="
                              selectedPositionData.startItems[i].ids[idx - 1]
                            "
                            class="mr-1"
                            large
                            v-bind:key="idx"
                            v-for="idx in selectedPositionData.startItems[i].ids
                              .length"
                          />
                        </td>
                        <td>
                          {{ selectedPositionData.startItems[i].pickRate }}%
                        </td>
                        <td>
                          {{ selectedPositionData.startItems[i].winRate }}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="data-table pl-2" v-else>
                    <thead class="table-title">
                      <tr>
                        <th>시작 아이템</th>
                        <th>픽률</th>
                        <th>승률</th>
                      </tr>
                    </thead>
                    <tbody class="table-content">
                      <tr>
                        <td class="data-none" colspan="3">
                          시작 아이템 데이터가 부족합니다.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="float__right d-inline-block vertical__top">
                  <div>
                    <table
                      class="data-table pl-2 "
                      style="width: 368px;"
                      v-if="summarizedCounters"
                    >
                      <thead class="table-title">
                        <tr>
                          <th :colspan="summarizedCounters.length">
                            카운터 챔피언
                          </th>
                        </tr>
                      </thead>
                      <tbody class="table-content">
                        <tr>
                          <td v-for="(n, i) in summarizedCounters.length">
                            <champion-icon
                              :championId="summarizedCounters[i].id"
                              :subText="
                                `${Math.floor(summarizedCounters[i].winRate)}%`
                              "
                              circle
                              class="mr-1"
                              small
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="data-table pl-2" style="width: 368px;" v-else>
                      <thead class="table-title">
                        <tr>
                          <th>카운터 챔피언</th>
                        </tr>
                      </thead>
                      <tbody class="table-content">
                        <tr>
                          <td class="data-none wide">
                            데이터가 부족합니다.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <table
                      class="data-table pl-2 "
                      style="width: 368px;"
                      v-if="summarizedEasyChampions"
                    >
                      <thead class="table-title">
                        <tr>
                          <th :colspan="summarizedEasyChampions.length">
                            상대하기 쉬운 챔피언
                          </th>
                        </tr>
                      </thead>
                      <tbody class="table-content">
                        <tr>
                          <td v-for="(n, i) in summarizedEasyChampions.length">
                            <champion-icon
                              :championId="summarizedEasyChampions[i].id"
                              :subText="
                                `${Math.floor(
                                  summarizedEasyChampions[i].winRate
                                )}%`
                              "
                              circle
                              class="mr-1"
                              small
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="data-table pl-2" style="width: 368px;" v-else>
                      <thead class="table-title">
                        <tr>
                          <th>상대하기 쉬운 챔피언</th>
                        </tr>
                      </thead>
                      <tbody class="table-content">
                        <tr>
                          <td class="data-none wide">
                            데이터가 부족합니다.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div
                  class="mt-3"
                  v-if="
                    selectedPositionData.runes &&
                      selectedPositionData.runes.length > 0
                  "
                >
                  <rune
                    :count="selectedPositionData.runes[i].count"
                    :mainRuneId="selectedPositionData.runes[i].mainRune"
                    :mainRuneStyleId="
                      selectedPositionData.runes[i].mainRuneStyle
                    "
                    :pick="selectedPositionData.runes[i].pickRate"
                    :selected="selectedRuneIndex === i"
                    :subRuneStyleId="selectedPositionData.runes[i].subRuneStyle"
                    :win="selectedPositionData.runes[i].winRate"
                    @click="clickRune(i)"
                    v-for="(n, i) in selectedPositionData.runes.length"
                  />

                  <div class="mt-4">
                    <div
                      class="rune-container pa-2 mr-3 d-inline-block"
                      v-for="(n, i) in selectedRuneData.details.length"
                    >
                      <tooltip
                        :content="`${selectedRuneData.details[i].count} 게임`"
                        center
                      >
                        <div class="rune-description text-xs-center mb-2">
                          픽률 : {{ selectedRuneData.details[i].pickRate }}%
                          <br />
                          승률 : {{ selectedRuneData.details[i].winRate }}%
                        </div>
                      </tooltip>
                      <div class="mr-3 d-inline-block vertical__top">
                        <v-layout>
                          <v-flex
                            class="text-xs-center"
                            v-bind:key="`${runeId}`"
                            v-for="runeId in runeIdList"
                          >
                            <rune-style-icon
                              :grayscale="
                                Number(runeId) !==
                                  selectedRuneData.mainRuneStyle
                              "
                              :runeStyleId="runeId"
                              class="mb-2"
                            />
                          </v-flex>
                        </v-layout>
                        <v-layout
                          class="mb-2"
                          justify-between-space
                          v-bind:key="`${line}`"
                          v-for="line in [0, 1, 2, 3]"
                        >
                          <v-layout>
                            <v-flex
                              class="text-xs-center"
                              v-bind:key="`${runeId}`"
                              v-for="runeId in Object.keys(
                                perks[selectedRuneData.mainRuneStyle].slots[
                                  line
                                ].runes
                              )"
                            >
                              <rune-icon
                                :borderColor="
                                  runeBorderColor[
                                    selectedRuneData.mainRuneStyle
                                  ]
                                "
                                :grayscale="
                                  Number(runeId) !==
                                    selectedRuneData.details[i].mainRunes[line]
                                "
                                :runeId="runeId"
                                :runeStyleId="selectedRuneData.mainRuneStyle"
                              />
                            </v-flex>
                          </v-layout>
                        </v-layout>
                      </div>

                      <div class="d-inline-block">
                        <v-layout justify-between-space>
                          <v-layout>
                            <v-flex
                              v-bind:key="`${runeId}`"
                              v-for="runeId in runeIdList"
                              v-show="
                                Number(runeId) !==
                                  selectedRuneData.mainRuneStyle
                              "
                            >
                              <rune-style-icon
                                :grayscale="
                                  Number(runeId) !==
                                    selectedRuneData.subRuneStyle
                                "
                                :runeStyleId="runeId"
                                class="mb-2"
                              />
                            </v-flex>
                          </v-layout>
                        </v-layout>
                        <v-layout
                          justify-between-space
                          v-bind:key="`${line}`"
                          v-for="line in [1, 2, 3]"
                        >
                          <v-layout>
                            <v-flex
                              v-bind:key="`${runeId}`"
                              v-for="runeId in Object.keys(
                                perks[selectedRuneData.subRuneStyle].slots[line]
                                  .runes
                              )"
                            >
                              <rune-icon
                                :borderColor="
                                  runeBorderColor[selectedRuneData.subRuneStyle]
                                "
                                :grayscale="
                                  !selectedRuneData.details[i].subRunes.find(
                                    (subRuneId) => subRuneId === Number(runeId)
                                  )
                                "
                                :runeId="runeId"
                                :runeStyleId="selectedRuneData.subRuneStyle"
                                class="mb-2"
                              />
                            </v-flex>
                          </v-layout>
                        </v-layout>

                        <div class="d-inline-block">
                          <v-layout justify-between-space>
                            <v-layout>
                              <v-flex
                                v-bind:key="`${runeId}`"
                                v-for="runeId in ['5008', '5005', '5007']"
                              >
                                <rune-icon
                                  :grayscale="
                                    selectedRuneData.details[i].statRunes[0] !==
                                      Number(runeId)
                                  "
                                  :runeId="runeId"
                                  borderColor="yellow"
                                  class="mb-2"
                                  runeStyleId="5000"
                                />
                              </v-flex>
                            </v-layout>
                          </v-layout>
                          <v-layout justify-between-space>
                            <v-layout>
                              <v-flex
                                v-bind:key="`${runeId}`"
                                v-for="runeId in ['5008', '5002', '5003']"
                              >
                                <rune-icon
                                  :grayscale="
                                    selectedRuneData.details[i].statRunes[1] !==
                                      Number(runeId)
                                  "
                                  :runeId="runeId"
                                  borderColor="yellow"
                                  class="mb-2"
                                  runeStyleId="5000"
                                />
                              </v-flex>
                            </v-layout>
                          </v-layout>
                          <v-layout justify-between-space>
                            <v-layout>
                              <v-flex
                                v-bind:key="`${runeId}`"
                                v-for="runeId in ['5001', '5002', '5003']"
                              >
                                <rune-icon
                                  :grayscale="
                                    selectedRuneData.details[i].statRunes[2] !==
                                      Number(runeId)
                                  "
                                  :runeId="runeId"
                                  borderColor="yellow"
                                  class="mb-2"
                                  runeStyleId="5000"
                                />
                              </v-flex>
                            </v-layout>
                          </v-layout>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </tab>
          </tabs>
        </div>
      </div>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import { toPercentage } from '@/base/math';
import Position from '@/components/Champion/Position.vue';
import Rune from '@/components/Champion/Rune.vue';
import ChampionIcon from '@/components/Icon/ChampionIcon.vue';
import ChampionPassiveIcon from '@/components/Icon/ChampionPassiveIcon.vue';
import ChampionSpellIcon from '@/components/Icon/ChampionSpellIcon.vue';
import ItemIcon from '@/components/Icon/ItemIcon.vue';
import RuneIcon from '@/components/Icon/RuneIcon.vue';
import RuneStyleIcon from '@/components/Icon/RuneStyleIcon.vue';
import SpellIcon from '@/components/Icon/SpellIcon.vue';
import RuneBook from '@/components/Rune/RuneBook.vue';
import Tab from '@/components/UI/Tab/Tab.vue';
import Tabs from '@/components/UI/Tab/Tabs.vue';
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { END_POINT } from '@/config';
import axios from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

const POSITION_NAME = ['unknown', 'top', 'jungle', 'mid', 'adc', 'support'];
const POSITION_ID: { [position: string]: number } = {
  top: 1,
  jungle: 2,
  mid: 3,
  adc: 4,
  support: 5,
};

interface IPositionData {
  spells: Array<{
    id1: number;
    id2: number;
    count: number;
    pickRate: number;
    winRate: number;
  }>;
  startItems: Array<{
    ids: number[];
    count: number;
    pickRate: number;
    winRate: number;
  }>;
  counters: Array<{
    id: number;
    count: number;
    winRate: number;
  }>;
  easys: Array<{
    id: number;
    count: number;
    winRate: number;
  }>;
  runes: Array<{
    mainRuneStyle: number;
    mainRune: number;
    subRuneStyle: number;
    pickRate: number;
    winRate: number;
    count: number;
    details: Array<{
      mainRunes: number[];
      subRunes: number[];
      statRunes: number[];
      pickRate: number;
      winRate: number;
      count: number;
    }>;
  }>;
}

@Component({
  components: {
    RuneBook,
    RuneIcon,
    RuneStyleIcon,
    Rune,
    ItemIcon,
    Tooltip,
    Position,
    SpellIcon,
    Tabs,
    Tab,
    ChampionSpellIcon,
    ChampionPassiveIcon,
    ChampionIcon,
  },
})
export default class ChampionInfo extends Vue {
  @Prop() private championId!: number;
  private selectedPosition: string = 'top';
  private totalCount: number = 0;
  private counts: { [position: string]: number } = {};
  private wins: { [position: string]: number } = {};
  private positionData: {
    [position: string]: IPositionData;
  } = {};
  private selectedRuneIndex: number = 0;
  private runeIdList: string[] = ['8000', '8100', '8200', '8300', '8400'];
  private runeBorderColor = {
    8000: 'yellow',
    8100: 'red',
    8200: 'purple',
    8300: 'blue',
    8400: 'green',
  };

  public get selectedPositionData() {
    return this.positionData[this.selectedPosition];
  }

  public get selectedRuneData() {
    return this.positionData[this.selectedPosition].runes[
      this.selectedRuneIndex
    ];
  }

  public get summarizedEasyChampions() {
    return (
      this.selectedPositionData.easys &&
      this.selectedPositionData.easys.slice(0, 6)
    );
  }

  public get summarizedCounters() {
    return (
      this.selectedPositionData.counters &&
      this.selectedPositionData.counters.slice(0, 6)
    );
  }

  public get champions() {
    return this.$store.state.lolstatic.champions;
  }

  public get perks() {
    return this.$store.state.lolstatic.perks;
  }

  public async getSpellData(position: string) {
    const response = await axios.get(
      `${END_POINT}/statistics/champion/spells/${this.championId}/${
        POSITION_ID[position]
      }`
    );
    const data: Array<{
      _id: number[];
      count: number;
      win: number;
    }> = response.data;
    const totalCount = data.reduce((prev, cur) => prev + cur.count, 0);
    const spells = data
      .map((spell) => ({
        id1: spell._id[0],
        id2: spell._id[1],
        count: spell.count,
        pickRate: toPercentage(spell.count, totalCount),
        winRate: toPercentage(spell.win, spell.count),
      }))
      .slice(0, 2);

    this.$set(
      this.positionData,
      position,
      Object.assign({}, this.positionData[position], {
        spells,
      })
    );
  }

  public async getStartItemData(position: string) {
    const response = await axios.get(
      `${END_POINT}/statistics/champion/startitems/${this.championId}/${
        POSITION_ID[position]
      }`
    );
    const data: Array<{
      _id: number[];
      count: number;
      win: number;
    }> = response.data;
    const totalCount = data.reduce((prev, cur) => prev + cur.count, 0);
    const startItems = data
      .map((item) => ({
        ids: item._id,
        count: item.count,
        pickRate: toPercentage(item.count, totalCount),
        winRate: toPercentage(item.win, item.count),
      }))
      .filter((item) => item.pickRate > 0)
      .slice(0, 2);

    this.$set(
      this.positionData,
      position,
      Object.assign({}, this.positionData[position], {
        startItems,
      })
    );
  }

  public async getRivalEasyData(position: string) {
    const response = await axios.get(
      `${END_POINT}/statistics/champion/easys/${this.championId}/${
        POSITION_ID[position]
      }`
    );
    const data: Array<{
      _id: number;
      count: number;
      win: number;
      win_rate: number;
    }> = response.data;
    const easys = data.map((rival) => ({
      id: rival._id,
      count: rival.count,
      winRate: rival.win_rate,
    }));

    this.$set(
      this.positionData,
      position,
      Object.assign({}, this.positionData[position], {
        easys,
      })
    );
  }

  public async getRivalCounterData(position: string) {
    const response = await axios.get(
      `${END_POINT}/statistics/champion/counters/${this.championId}/${
        POSITION_ID[position]
      }`
    );
    const data: Array<{
      _id: number;
      count: number;
      win: number;
      win_rate: number;
    }> = response.data;
    const counters = data.map((rival) => ({
      id: rival._id,
      count: rival.count,
      winRate: rival.win_rate,
    }));

    this.$set(
      this.positionData,
      position,
      Object.assign({}, this.positionData[position], {
        counters,
      })
    );
  }

  public async getRuneData(position: string) {
    const response = await axios.get(
      `${END_POINT}/statistics/champion/runes/${this.championId}/${
        POSITION_ID[position]
      }`
    );
    const data: Array<{
      _id: {
        mainRuneStyle: number;
        mainRune: number;
        subRuneStyle: number;
      };
      count: number;
      win: number;
    }> = response.data;
    const totalCount = data.reduce((prev, cur) => prev + cur.count, 0);
    const runes = data.map((rune) => ({
      mainRuneStyle: rune._id.mainRuneStyle,
      mainRune: rune._id.mainRune,
      subRuneStyle: rune._id.subRuneStyle,
      pickRate: toPercentage(rune.count, totalCount, 2),
      winRate: toPercentage(rune.win, rune.count, 2),
      count: rune.count,
      details: [] as any[],
    })).slice(0, 3);

    for (const rune of runes) {
      rune.details = await this.getRuneDetailData(
        position,
        rune.mainRune,
        rune.subRuneStyle,
        totalCount
      );
    }
    this.$set(
      this.positionData,
      position,
      Object.assign({}, this.positionData[position], {
        runes,
      })
    );
  }

  public async getRuneDetailData(
    position: string,
    mainRuneId: number,
    subRuneStyleId: number,
    totalCount: number
  ) {
    const response = await axios.get(
      `${END_POINT}/statistics/champion/rune/${this.championId}/${
        POSITION_ID[position]
      }/${mainRuneId}/${subRuneStyleId}`
    );
    const data: Array<{
      _id: {
        mainRunes: number[];
        subRunes: number[];
        statRunes: number[];
      };
      count: number;
      win: number;
    }> = response.data;
    return data.map((rune) => ({
      mainRunes: rune._id.mainRunes,
      subRunes: rune._id.subRunes,
      statRunes: rune._id.statRunes,
      pickRate: toPercentage(rune.count, totalCount, 2),
      winRate: toPercentage(rune.win, rune.count, 2),
      count: rune.count,
    })).slice(0, 3);
  }

  public async clickPosition(position: string) {
    this.selectedPosition = position;

    if (!this.positionData[position]) {
      try {
        await Promise.all([
          this.getSpellData(position),
          this.getStartItemData(position),
          this.getRivalCounterData(position),
          this.getRivalEasyData(position),
          this.getRuneData(position),
        ]);
      } catch (err) {
        console.log(err);
      }
    }
  }

  public async clickRune(runeIndex: number) {
    this.selectedRuneIndex = runeIndex;
  }

  public async mounted() {
    const response = await axios.get(
      `${END_POINT}/statistics/champion/positions/${this.championId}`
    );
    const data: Array<{ _id: number; count: number; win: number }> =
      response.data;
    this.totalCount = data.reduce((prev, cur) => prev + cur.count, 0);
    data.forEach((position) => {
      this.$set(this.counts, POSITION_NAME[position._id], position.count);
      this.$set(this.wins, POSITION_NAME[position._id], position.win);
    });

    await this.clickPosition(POSITION_NAME[data[0]._id]);
  }
}
</script>

<style lang="scss" scoped>
#champion-info {
  overflow-y: auto;
}

.champion-info-container {
  text-align: left;

  & > div {
    vertical-align: top;
  }

  .champion-name {
    font-size: 25px;
    font-weight: bold;
  }
}

.data-table {
  border-spacing: 0;

  .table-title {
    th {
      text-align: center;
      padding-bottom: 10px;
      border-bottom: 2px solid #e57c5b;
      font-size: 13px;
    }
  }

  .table-content {
    td {
      padding: 10px;
      text-align: center;
    }
  }
}

.divider {
  display: inline-block;
  width: 1px;
  background-color: #ccc;
}

.data-none {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  height: 80px;

  &.wide {
    width: 350px;
  }
}

.rune-container {
  border: 1px solid #ccc;
  border-radius: 10px;

  .rune-description {
    font-size: 12px;
  }
}
</style>
