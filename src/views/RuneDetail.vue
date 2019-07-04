<template>
  <v-layout fill-height column id="rune-detail-page">
    <div>
      <v-layout align-center px-3>
        <v-img :src="champions[championId].iconUrl" class="champion-icon mr-3" />
        <span class="title">{{champions[championId].name}}</span>
      </v-layout>
    </div>
  </v-layout>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class Home extends Vue {
  @Prop() public championId!: number;
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
.champion-icon {
  min-width: 50px;
  min-height: 50px;
  max-width: 50px;
  max-height: 50px;
}
</style>
