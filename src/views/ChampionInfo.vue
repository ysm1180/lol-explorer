<template>
  <v-layout fill-height justify-center>
    <v-layout align-center column id="champion-info" mt-4>
      <div class="champion-info-container">
        <div class="mb-5">
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

          <div class="float__right d-inline-block item-container">
            <Trend
              :chartData="{
                labels: banRateLabels,
                datasets: [
                  {
                    lineTension: 0,
                    borderColor:
                      banRateData[2] - banRateData[1] > 0
                        ? '#62b7e5'
                        : banRateData[2] - banRateData[1] === 0
                        ? '#666'
                        : '#e53d60',
                    backgroundColor: 'transparent',
                    data: banRateData,
                  },
                ],
              }"
              height="90"
              hideYTick
              title="밴률"
              tooltipLabel="밴률"
              width="150"
            />
          </div>
        </div>

        <v-layout>

          <v-flex>
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
          </v-flex>
        </v-layout>

        <div>
          <tabs>
            <tab :selected="true" name="종합">
              <div class="mt-3" v-if="selectedPositionData">
                <div class="d-inline-block data-container mr-3">
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
                            />
                            <spell-icon
                              :spellId="selectedPositionData.spells[i].id2"
                            />
                          </td>
                          <td>
                            {{ selectedPositionData.spells[i].pickRate }}%
                          </td>
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

                  <div class="divider" style="height: 138px;"></div>

                  <div class="d-inline-block vertical__top mx-2">
                    <table
                      class="data-table"
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
                          v-for="(n, i) in selectedPositionData.startItems
                            .length"
                        >
                          <td>
                            <item-icon
                              :itemId="
                                selectedPositionData.startItems[i].ids[idx - 1]
                              "
                              class="mr-1"
                              v-bind:key="idx"
                              v-for="idx in selectedPositionData.startItems[i]
                                .ids.length"
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

                  <div class="divider" style="height: 138px;"></div>

                  <div class="d-inline-block vertical__top ml-2">
                    <table
                      class="data-table"
                      v-if="
                        selectedPositionData.shoes &&
                          selectedPositionData.shoes.length > 0
                      "
                    >
                      <thead class="table-title">
                        <tr>
                          <th>신발</th>
                          <th>픽률</th>
                          <th>승률</th>
                        </tr>
                      </thead>
                      <tbody class="table-content">
                        <tr
                          v-bind:key="i"
                          v-for="(n, i) in selectedPositionData.shoes.length"
                        >
                          <td>
                            <item-icon
                              :itemId="selectedPositionData.shoes[i].shoes"
                              class="mr-1"
                            />
                          </td>
                          <td>{{ selectedPositionData.shoes[i].pickRate }}%</td>
                          <td>{{ selectedPositionData.shoes[i].winRate }}%</td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="data-table" v-else>
                      <thead class="table-title">
                        <tr>
                          <th>신발</th>
                          <th>픽률</th>
                          <th>승률</th>
                        </tr>
                      </thead>
                      <tbody class="table-content">
                        <tr>
                          <td class="data-none" colspan="3">
                            신발 통계 데이터가 없습니다.
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
                      :subRuneStyleId="
                        selectedPositionData.runes[i].subRuneStyle
                      "
                      :win="selectedPositionData.runes[i].winRate"
                      @click="clickRune(i)"
                      v-for="(n, i) in selectedPositionData.runes.length"
                    />

                    <div class="mt-4">
                      <div
                        class="rune-container pa-2 my-3"
                        v-for="(n, i) in selectedRuneData.details.length"
                      >
                        <tooltip
                          :content="`${selectedRuneData.details[i].count} 게임`"
                          center
                          inlineBlock
                        >
                          <div class="rune-description">
                            픽률 : {{ selectedRuneData.details[i].pickRate }}%
                            <br />
                            승률 : {{ selectedRuneData.details[i].winRate }}%
                          </div>
                        </tooltip>
                        <div class="divider mx-3" style="height: 270px;"></div>
                        <rune-book
                          :primaryRuneStyle="
                            selectedRuneData.mainRuneStyle.toString()
                          "
                          :primaryRunes="selectedRuneData.details[i].mainRunes"
                          :secondaryRuneStyle="selectedRuneData.subRuneStyle"
                          :secondaryRunes="selectedRuneData.details[i].subRunes"
                          :statRunes="selectedRuneData.details[i].statRunes"
                          containerWidth="180"
                          grayscale
                        />
                      </div>
                    </div>
                  </div>
                  <div class="mt-5 data-none" v-else>
                    데이터가 부족하여 룬 데이터 분석이 어렵습니다.
                  </div>
                </div>

                <div class="float__right d-inline-block vertical__top data-container">
                  <Tabs alignCenter class="mb-3">
                    <Tab name="카운터 챔피언" selected>
                      <v-layout
                        align-center
                        class="py-3"
                        justify-center
                        v-if="
                          summarizedCounters && summarizedCounters.length > 0
                        "
                      >
                        <v-flex
                          class="text-center"
                          v-for="(n, i) in summarizedCounters.length"
                        >
                          <champion-icon
                            :championId="summarizedCounters[i].id"
                            :subText="
                              `${Math.floor(summarizedCounters[i].winRate)}%`
                            "
                            circle
                            class="mr-1"
                            small
                          />
                        </v-flex>
                      </v-layout>
                      <v-layout
                        align-center
                        class="data-none wide"
                        justify-center
                        v-else
                      >
                        데이터가 부족합니다.
                      </v-layout>
                    </Tab>
                    <Tab name="상대하기 쉬운 챔피언">
                      <v-layout
                        align-center
                        class="py-3"
                        justify-center
                        v-if="
                          summarizedEasyChampions &&
                            summarizedEasyChampions.length > 0
                        "
                      >
                        <v-flex
                          class="text-center"
                          v-for="(n, i) in summarizedEasyChampions.length"
                        >
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
                        </v-flex>
                      </v-layout>
                      <v-layout
                        align-center
                        class="data-none wide"
                        justify-center
                        v-else
                      >
                        데이터가 부족합니다.
                      </v-layout>
                    </Tab>
                  </Tabs>

                  <div class="item-container mb-2" v-if="winRateData">
                    <Trend
                      :chartData="{
                        labels: winRateLabels,
                        datasets: [
                          {
                            lineTension: 0,
                            borderColor:
                              winRateData[2] - winRateData[1] > 0
                                ? '#62b7e5'
                                : winRateData[2] - winRateData[1] === 0
                                ? '#666'
                                : '#e53d60',
                            backgroundColor: 'transparent',
                            data: winRateData,
                          },
                        ],
                      }"
                      height="130"
                      hideYTick
                      title="승률"
                      tooltipLabel="승률"
                      width="150"
                    />
                  </div>

                  <div class="item-container mb-2" v-if="pickRateData">
                    <Trend
                      :chartData="{
                        labels: pickRateLabels,
                        datasets: [
                          {
                            lineTension: 0,
                            borderColor:
                              pickRateData[2] - pickRateData[1] > 0
                                ? '#62b7e5'
                                : pickRateData[2] - pickRateData[1] === 0
                                ? '#666'
                                : '#e53d60',
                            backgroundColor: 'transparent',
                            data: pickRateData,
                          },
                        ],
                      }"
                      height="130"
                      hideYTick
                      title="픽률"
                      tooltipLabel="픽률"
                      width="150"
                    />
                  </div>
                </div>
              </div>
              <v-layout fill-height align-center justify-center v-else>
                <v-flex class="text-center">
                  <v-progress-circular
                    color="deep-orange lighten-2"
                    indeterminate
                    size="32"
                  />
                </v-flex>
              </v-layout>
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
import Trend from '@/components/Champion/Trend.vue';
import ChampionIcon from '@/components/Icon/ChampionIcon.vue';
import ChampionPassiveIcon from '@/components/Icon/ChampionPassiveIcon.vue';
import ChampionSpellIcon from '@/components/Icon/ChampionSpellIcon.vue';
import ItemIcon from '@/components/Icon/ItemIcon.vue';
import RuneIcon from '@/components/Icon/RuneIcon.vue';
import RuneStyleIcon from '@/components/Icon/RuneStyleIcon.vue';
import SpellIcon from '@/components/Icon/SpellIcon.vue';
import RuneBook from '@/components/Rune/RuneBook.vue';
import LineChart from '@/components/UI/Chart/LineChart.vue';
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

interface PositionData {
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
    mainRuneStyle: string;
    mainRune: string;
    subRuneStyle: string;
    pickRate: number;
    winRate: number;
    count: number;
    details: Array<{
      mainRunes: string[];
      subRunes: string[];
      statRunes: string[];
      pickRate: number;
      winRate: number;
      count: number;
    }>;
  }>;
  trends: Array<{
    gameVersion: string;
    win: number;
    count: number;
    totalCount: number;
  }>;
  shoes: Array<{
    shoes: number;
    count: number;
    pickRate: number;
    winRate: number;
  }>;
}

interface StatisticsCount {
  win: number;
  count: number;
}

interface TrendApiData extends StatisticsCount {
  gameVersion: string;
  totalCount: number;
}

interface SpellApiData extends StatisticsCount {
  spells: number[];
}

interface ItemsApiData extends StatisticsCount {
  items: number[];
}

interface RivalMatchUpApiData extends StatisticsCount {
  rivalChampionKey: number;
  winRate: number;
}

interface RuneDetail extends StatisticsCount {
  mainRunes: number[];
  subRunes: number[];
  statRunes: number[];
}

interface RuneGroupApiData extends StatisticsCount {
  mainRuneStyle: number;
  mainRune: number;
  subRuneStyle: number;
  details: RuneDetail[];
}

interface ShoesApiData extends StatisticsCount {
  shoes: number;
}

interface BanData {
  gameVersion: string;
  count: number;
  totalCount: number;
}

@Component({
  components: {
    Trend,
    LineChart,
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
    [position: string]: PositionData;
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
  private banRates: BanData[] = [];

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

  public get banRateData() {
    return this.banRates.map((ban) =>
      toPercentage(ban.count, ban.totalCount, 2)
    );
  }

  public get banRateLabels() {
    return this.banRates.map((ban) => ban.gameVersion);
  }

  public get winRateLabels() {
    return this.selectedPositionData.trends
      ? this.selectedPositionData.trends.map((trend) => trend.gameVersion)
      : [];
  }

  public get winRateData() {
    return this.selectedPositionData.trends
      ? this.selectedPositionData.trends.map((trend) =>
          toPercentage(trend.win, trend.count)
        )
      : [];
  }

  public get pickRateLabels() {
    return (
      this.selectedPositionData.trends &&
      this.selectedPositionData.trends.map((trend) => trend.gameVersion)
    );
  }

  public get pickRateData() {
    return (
      this.selectedPositionData.trends &&
      this.selectedPositionData.trends.map((trend) =>
        toPercentage(trend.count, trend.totalCount)
      )
    );
  }

  public async getSummaryBanRate() {
    try {
      const response = await axios.get(
        `${END_POINT}/statistics/champion/bans/${this.championId}/3`
      );
      this.banRates = response.data as BanData[];
    } catch (err) {
      console.error('[getSummaryBanRate]', err);
    }
  }

  public async getChampionStatisticsByPosition(position: string) {
    try {
      const response = await axios.get(
        `${END_POINT}/statistics/champion/${this.championId}/${
          POSITION_ID[position]
        }`
      );

      this.loadTrendData(position, response.data.trends);
      this.loadSpellData(position, response.data.spells);
      this.loadStartItemData(position, response.data.startItems);
      this.loadRivalEasyData(position, response.data.easys);
      this.loadRivalCounterData(position, response.data.counters);
      this.loadRuneGroupData(position, response.data.runeGroups);
      this.loadShoesData(position, response.data.shoes);
    } catch (err) {
      console.error('[getChampionStatisticsByPosition]', err);
    }
  }

  private loadSpellData(position: string, data: SpellApiData[]) {
    const totalCount = data.reduce((prev, cur) => prev + cur.count, 0);
    const spells = data
      .map((spell) => ({
        id1: spell.spells[0],
        id2: spell.spells[1],
        count: spell.count,
        pickRate: toPercentage(spell.count, totalCount),
        winRate: toPercentage(spell.win, spell.count),
      }))
      .slice(0, 3);

    this.$set(
      this.positionData,
      position,
      Object.assign({}, this.positionData[position], {
        spells,
      })
    );
  }

  public loadStartItemData(position: string, data: ItemsApiData[]) {
    const totalCount = data.reduce((prev, cur) => prev + cur.count, 0);
    const startItems = data
      .map((item) => ({
        ids: item.items,
        count: item.count,
        pickRate: toPercentage(item.count, totalCount),
        winRate: toPercentage(item.win, item.count),
      }))
      .filter((item) => item.pickRate > 0)
      .slice(0, 3);

    this.$set(
      this.positionData,
      position,
      Object.assign({}, this.positionData[position], {
        startItems,
      })
    );
  }

  public loadRivalEasyData(position: string, data: RivalMatchUpApiData[]) {
    const easys = data.map((rival) => ({
      id: rival.rivalChampionKey,
      count: rival.count,
      winRate: rival.winRate,
    }));

    this.$set(
      this.positionData,
      position,
      Object.assign({}, this.positionData[position], {
        easys,
      })
    );
  }

  public loadRivalCounterData(position: string, data: RivalMatchUpApiData[]) {
    const counters = data.map((rival) => ({
      id: rival.rivalChampionKey,
      count: rival.count,
      winRate: rival.winRate,
    }));

    this.$set(
      this.positionData,
      position,
      Object.assign({}, this.positionData[position], {
        counters,
      })
    );
  }

  public loadRuneGroupData(position: string, data: RuneGroupApiData[]) {
    const totalCount = data.reduce((prev, cur) => prev + cur.count, 0);
    const runes = data
      .map((rune) => {
        return {
          mainRuneStyle: rune.mainRuneStyle.toString(),
          mainRune: rune.mainRune.toString(),
          subRuneStyle:
            (rune.subRuneStyle && rune.subRuneStyle.toString()) || '0',
          pickRate: toPercentage(rune.count, totalCount, 2),
          winRate: toPercentage(rune.win, rune.count, 2),
          count: rune.count,
          details: rune.details
            .map((detail) => ({
              mainRunes: detail.mainRunes.map((rune) => rune.toString()),
              subRunes: detail.subRunes.map((rune) => rune.toString()),
              statRunes: detail.statRunes.map((rune) => rune.toString()),
              pickRate: toPercentage(detail.count, totalCount, 2),
              winRate: toPercentage(detail.win, detail.count, 2),
              count: detail.count,
            }))
            .slice(0, 2),
        };
      })
      .slice(0, 2);

    this.$set(
      this.positionData,
      position,
      Object.assign({}, this.positionData[position], {
        runes,
      })
    );
  }

  public loadTrendData(position: string, trends: TrendApiData[]) {
    this.$set(
      this.positionData,
      position,
      Object.assign({}, this.positionData[position], {
        trends,
      })
    );
  }

  public loadShoesData(position: string, data: ShoesApiData[]) {
    const totalCount = data.reduce((prev, cur) => prev + cur.count, 0);
    const shoes = data
      .map((shoesData) => ({
        shoes: shoesData.shoes,
        count: shoesData.count,
        pickRate: toPercentage(shoesData.count, totalCount),
        winRate: toPercentage(shoesData.win, shoesData.count),
      }))
      .filter((shoesData) => shoesData.pickRate > 0)
      .slice(0, 3);

    this.$set(
      this.positionData,
      position,
      Object.assign({}, this.positionData[position], {
        shoes,
      })
    );
  }

  public async clickPosition(position: string) {
    this.selectedPosition = position;

    if (!this.positionData[position]) {
      try {
        await this.getChampionStatisticsByPosition(position);
      } catch (err) {
        console.error(err);
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

    await this.getSummaryBanRate();
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

  div {
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
      padding: 7px 0;
      border-bottom: 2px solid #e57c5b;
      font-size: 12px;
    }
  }

  .table-content {
    td {
      padding: 10px 10px 0 10px;
      text-align: center;
      font-size: 13px;
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
    width: 310px;
  }
}

.rune-container {
  border-left: 5px solid #ff8a65;
  background-color: #ffffff;
  padding: 10px;

  .rune-description {
    padding: 10px;
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
  }
}

.item-container {
  border-left: 5px solid #ff8a65;
  background-color: #ffffff;
  padding: 10px;
}

  .data-container {
    border: 1px solid #E0E0E0;
    padding: 5px 15px 15px 15px;
    background-color: #EEEEEE;
  }
</style>
