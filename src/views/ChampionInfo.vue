<template>
  <v-layout fill-height justify-center >
    <v-layout align-center column px-4 py-3>
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
                  <table class="spell-table" v-if="selectedPositionData.spells && selectedPositionData.spells.length > 0">
                    <thead class="table-title">
                      <tr>
                        <th>소환사 주문</th>
                        <th>픽률</th>
                        <th>승률</th>
                      </tr>
                    </thead>
                    <tbody class="table-content">
                      <tr
                        v-for="(n, i) in selectedPositionData.spells.length > 2 ? 2 : selectedPositionData.spells.length"
                        v-bind:key="i"
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
                  <div class="data-none" v-else>
                    소환사 주문 통계 데이터가 없습니다.
                  </div>
                </div>

                <div class="d-inline-block">
                  <table
                    class="start-item-table pl-2"
                    v-if="selectedPositionData.startItems && selectedPositionData.startItems.length > 0 "
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
                        v-for="(n, i) in selectedPositionData.startItems.length > 3 ? 3 : selectedPositionData.startItems.length"
                        v-bind:key="i"
                      >
                        <td>
                          <item-icon
                            :itemId="selectedPositionData.startItems[i].ids[idx - 1]"
                            class="mr-1" large
                            v-for="idx in selectedPositionData.startItems[i].ids.length"
                            v-bind:key="idx"
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
                  <div class="data-none" v-else>
                    시작 아이템 통계 데이터가 없습니다.
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
import ChampionIcon from '@/components/Icon/ChampionIcon.vue';
import ChampionPassiveIcon from '@/components/Icon/ChampionPassiveIcon.vue';
import ChampionSpellIcon from '@/components/Icon/ChampionSpellIcon.vue';
import ItemIcon from '@/components/Icon/ItemIcon.vue';
import SpellIcon from '@/components/Icon/SpellIcon.vue';
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
}

@Component({
  components: {
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

  public get selectedPositionData() {
    return this.positionData[this.selectedPosition];
  }

  public get champions() {
    return this.$store.state.lolstatic.champions;
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
    const spells = data.map((spell) => ({
      id1: spell._id[0],
      id2: spell._id[1],
      count: spell.count,
      pickRate: toPercentage(spell.count, totalCount),
      winRate: toPercentage(spell.win, spell.count),
    }));

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
    const startItems = data.map((item) => ({
      ids: item._id,
      count: item.count,
      pickRate: toPercentage(item.count, totalCount),
      winRate: toPercentage(item.win, item.count),
    }));

    this.$set(
      this.positionData,
      position,
      Object.assign({}, this.positionData[position], {
        startItems,
      })
    );
  }

  public async clickPosition(position: string) {
    this.selectedPosition = position;

    if (!this.positionData[position]) {
      try {
        await Promise.all([
          this.getSpellData(position),
          this.getStartItemData(position),
        ]);
      } catch (err) {
        console.log(err);
      }
    }
  }

  public async mounted() {
    console.log(this.championId);

    const response = await axios.get(
      `${END_POINT}/statistics/champion/positions/${this.championId}`
    );
    const data: Array<{ _id: number; count: number; win: number }> = response.data;
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

.spell-table {
  border-spacing: 0;

  .table-title {
    th {
      text-align: center;
      padding-bottom: 10px;
      border-bottom: 2px solid #e57c5b;
    }
  }

  .table-content {
    td {
      padding: 10px;
    }
  }
}

.start-item-table {
  border-spacing: 0;
  border-left: 1px solid #ccc;

  .table-title {
    th {
      text-align: center;
      padding-bottom: 10px;
      border-bottom: 2px solid #e57c5b;
    }
  }

  .table-content {
    td {
      padding: 10px;
    }
  }
}

  .data-none {
    font-size: 12px;
    font-weight: bold;
  }
</style>
