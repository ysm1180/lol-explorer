<template>
  <v-layout class="item-icon-container" d-inline-block ref="container">
    <tooltip :content="itemContent" :title="item.name" html v-if="item">
      <v-img :src="item ? item.iconUrl : ''" class="item-icon grey" />
    </tooltip>
    <v-img class="item-icon grey" v-else />
  </v-layout>
</template>

<script lang="ts">
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { IStaticItem } from '@/typings/static-data';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: { Tooltip },
})
export default class ItemIcon extends Vue {
  @Prop() private itemId!: number;

  public get itemContent() {
    return (
      (this.item.plaintext !== '' ? this.item.plaintext + '<br />' : '') +
      this.item.description +
      '<br />가격 : <span class="yellow--text">' +
      this.item.gold.total +
      '</span>'
    );
  }

  public get item() {
    return (
      (this.$store.state.lolstatic.items[this.itemId] as IStaticItem) || null
    );
  }
}
</script>

<style lang="scss" scoped>
.item-icon-container {
  position: relative;
  vertical-align: top;
  text-align: left;

  .item-icon {
    vertical-align: top;

    min-width: 23px;
    min-height: 23px;
    max-width: 23px;
    max-height: 23px;
    border-radius: 3px;
  }
}
</style>
