<template>
  <v-layout fill-height column id="rune-detail-page">
    <div class="mb-3">
      <v-layout align-center px-3>
        <v-img :src="champions[championId].iconUrl" class="champion-icon mr-3" />
        <span class="title">{{champions[championId].name}}</span>
      </v-layout>
    </div>
    <div style="width:250px;" class="px-3">
      <v-select
        dark attach
        :items="items"
        item-text="name"
        item-value="value"
        v-model="pageNum"
      />
    </div>
    <div class="ml-5">
      <rune-page />
    </div>
  </v-layout>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { Component, Vue, Prop } from 'vue-property-decorator';
import RunePage from '../components/Rune/RunePage.vue';

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
      name: '추천1',
      value: 1,
    },
    {
      name: '추천2',
      value: 2,
    },
    {
      name: '사용자1',
      value: 3,
    },
    {
      name: '사용자2',
      value: 4,
    },
  ];
  public mounted(): void {}

  get champions() {
    return this.$store.state.lolstatic.champions;
  }
}
</script>
<style scoped>
#rune-detail-page {
  overflow-y: auto;
}
#rune-title {
  height: 50px;
}
.champion-icon {
  min-width: 50px;
  min-height: 50px;
  max-width: 50px;
  max-height: 50px;
}
</style>
