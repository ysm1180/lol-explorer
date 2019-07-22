<template>
  <v-layout column fill-height id="rune-detail-page">
    <div class="mb-3">
      <v-layout align-center px-3>
        <v-img
          :src="champions[championId].iconUrl"
          class="champion-icon mr-3"
        />
        <span class="title">{{ champions[championId].name }}</span>
      </v-layout>
    </div>
    <div class="px-3" style="width:250px;">
      <v-select
        :items="items"
        attach
        item-text="name"
        item-value="value"
        v-model="pageNum"
      ></v-select>
    </div>
    <div class="ml-5">
      <rune-page
        :perk="perk"
        @save="save"
      />
    </div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import RunePage from '../components/Rune/RunePage.vue';

const ENDPOINT = 'http://localhost:3000';

@Component({
  components: {
    'rune-page': RunePage,
  },
})
export default class Home extends Vue {
  @Prop() public championId!: number;
  public pageNum: number = 1;
  public items: any[] = [
    {
      name: '룬페이지1',
      value: 1,
    },
    {
      name: '룬페이지2',
      value: 2,
    },
    {
      name: '룬페이지3',
      value: 3,
    },
  ];

  public mounted(): void {}

  get champions() {
    return this.$store.state.lolstatic.champions;
  }
  get perk() {
    const fs = require('fs');
    try {
      const data = fs.readFileSync(`perk/${this.championId}_${this.pageNum}.json`, 'utf8');
      const perk = JSON.parse(data);
      return perk;
    } catch (e) {
      const perk = {
        primary: {
          id: '8000',
          slot0: '0',
          slot1: '0',
          slot2: '0',
          slot3: '0',
        },
        secondary: {
          id: '8100',
          slot1: '0',
          slot2: '0',
          slot3: '0',
        },
        stat: {
          stat1: '0',
          stat2: '0',
          stat3: '0',
        },
      };
      return perk;
    }
  }

  public save(perk: any) {
    const content = {
      [this.championId]: perk,
    };
    const fs = require('fs');
    try {
      if (!fs.existsSync('perk')) {
        fs.mkdirSync('perk');
      }
      fs.writeFileSync(`perk/${this.championId}_${this.pageNum}.json`, JSON.stringify(perk), 'utf-8');
    } catch (e) {
      console.log(e);
    }
  }
}
</script>
<style scoped>
#rune-detail-page {
  overflow-y: auto;
}

.champion-icon {
  min-width: 50px;
  min-height: 50px;
  max-width: 50px;
  max-height: 50px;
}
</style>
