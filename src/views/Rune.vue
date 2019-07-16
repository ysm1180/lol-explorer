<template>
  <v-layout column fill-height id="rune-page">
    <div>
      <v-layout align-center justify-space-between px-5>
        <v-flex text-xs-left xs4>
          <span class="title">챔피언을 선택해주세요</span>
        </v-flex>
        <v-flex xs4>
          <v-text-field
            color="white"
            id="search-field"
            label="검색"
            v-model="keyword"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </div>
    <v-layout align-content-start wrap>
      <div
        class="ma-2"
        style=""
        v-bind:key="index"
        v-for="(champion, index) in searchedChampions"
      >
        <v-img
          :src="champion.iconUrl"
          :title="champion.name"
          @click="$router.push(`/rune/${champion.key}`)"
          class="champion-icon"
        />
      </div>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component({
  components: {},
})
export default class Home extends Vue {
  private keyword: string = '';

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

  public get searchedChampions() {
    return this.sortedChampions.filter((element: any) => {
      return element.name.includes(this.keyword);
    });
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
