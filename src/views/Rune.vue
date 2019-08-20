<template>
  <v-layout fill-height>
    <v-layout fill-height column id="rune-page">
      <div>
        <v-layout align-center justify-space-between mx-3>
          <v-flex xs4>
            <v-text-field
              color="white"
              id="search-field"
              label="챔피언 이름 검색"
              v-model="keyword"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </div>
      <v-layout align-content-start wrap px-2>
        <div
          class="ma-2"
          style=""
          v-bind:key="index"
          v-for="(champion, index) in searchedChampions"
        >
          <champion-icon
            extralarge
            class="cursor__pointer"
            :championId="champion.key"
            @click="showModal(champion.key)"
          />
          <div class="champion-name">{{champion.name }}</div>
        </div>
      </v-layout>

      <rune-page
        v-show="modal"
        :rune="getRuneByChampion(selectedChampionKey)"
        :championId="selectedChampionKey"
        @click="hideModal()"
        @save="save"
      ></rune-page>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import ChampionIcon from '@/components/Icon/ChampionIcon.vue';
import RunePage from '@/components/Rune/RunePage.vue';
import { IStaticChampions } from '@/store/modules/lolstatic';
import {CustomRuneData} from '@/typings/rune';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: { ChampionIcon, RunePage },
})
export default class Rune extends Vue {
  private keyword: string = '';
  private modal: boolean = false;
  private selectedChampionKey: number = 0;

  public mounted(): void {}

  get champions() {
    return this.$store.state.lolstatic.champions as IStaticChampions;
  }

  get sortedChampions() {
    const array = Object.values(this.champions);
    array.sort((a: any, b: any) => {
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      } else {
        return 0;
      }
    });

    return array;
  }

  public get searchedChampions() {
    return this.sortedChampions.filter((element: any) => {
      return element.name.includes(this.keyword);
    });
  }

  public getRuneByChampion(championKey: number): CustomRuneData {
    const fs = require('fs');
    try {
      const data = fs.readFileSync(`runes/${championKey}.json`, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return {
        primary: {
          id: '8000',
          slots: ['0', '0', '0', '0'],
        },
        secondary: {
          id: '8100',
          slots: [],
        },
        stat: ['0', '0', '0'],
      };
    }
  }

  public showModal(championKey: number) {
    this.selectedChampionKey = championKey;
    this.modal = true;
  }

  public hideModal() {
    this.selectedChampionKey = 0;
    this.modal = false;
  }

  public save(rune: CustomRuneData) {
    const fs = require('fs');
    try {
      if (!fs.existsSync('runes')) {
        fs.mkdirSync('runes');
      }
      fs.writeFileSync(
        `runes/${this.selectedChampionKey}.json`,
        JSON.stringify(rune),
        'utf-8'
      );
    } catch (e) {
      console.log(e);
    }
  }
}
</script>
<style scoped>
#rune-page {
  overflow-y: auto;
}

  .champion-name {
    margin-top: 2px;

    font-size: 12px;
    text-align: left;
  }
</style>
