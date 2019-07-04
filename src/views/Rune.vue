<template>
  <v-layout fill-height column id="rune-page">
    <div>
      <v-layout align-center justify-space-between px-5>
        <v-flex xs4 text-xs-left>
          <span class="title">챔피언을 선택해주세요</span>
        </v-flex>
        <v-flex xs4>
          <v-text-field v-model="keyword" label="검색" color="white" id="search-field" />
        </v-flex>
      </v-layout>
    </div>
    <v-layout wrap align-content-start>
      <div v-for="(champion, index) in searchedChampions" v-bind:key="index" class="ma-2" style="">
        <v-img :src="champion.iconUrl" :title="champion.name" class="champion-icon"
          @click="$router.push(`/rune/${champion.key}`)"
        />
      </div>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class Home extends Vue {
  public keyword: string = '';

  public mounted(): void {}

  get champions() {
    return this.$store.state.lolstatic.champions;
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
  get searchedChampions() {
    const searchedChampions = this.sortedChampions.filter((element: any) => {
      return element.name.includes(this.keyword);
    });
    return searchedChampions;
  }
}
</script>
<style scoped>
#rune-page {
  overflow-y: auto;
}
.champion-icon {
  min-width: 50px;
  min-height: 50px;
  max-width: 50px;
  max-height: 50px;
  cursor: pointer;
}
</style>
