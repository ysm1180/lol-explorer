<template>
  <v-layout class="item-icon-container" d-inline-block>
    <div ref="tooltip" class="item-tooltip" v-if="item && isHover">
      <div class="tooltip-title">
        {{ item.name }}
      </div>
      <div class="tooltip-content html-content" v-html="itemContent"></div>
    </div>
    <v-img
      @mouseenter="hover()"
      @mouseleave="leave()"
      :src="item ? item.iconUrl : ''"
      class="item-icon grey darken-2"
    />
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IStaticItem } from '@/typings/static-data';

@Component
export default class ItemIcon extends Vue {
  @Prop() private itemId!: number;
  private isHover: boolean = false;

  public hover() {
    this.isHover = true;
  }

  public leave() {
    this.isHover = false;
  }

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

<style scoped lang="scss">
.item-icon-container {
  position: relative;
  vertical-align: top;
  text-align: left;

  .item-tooltip {
    position: absolute;
    background-color: black;
    color: white;
    bottom: 150%;
    width: 330px;
    padding: 10px;
    z-index: 3;
    left: -155px;

    & > .tooltip-title {
      font-size: 13px;
      font-weight: bold;
      color: orange;
      margin-bottom: 5px;
    }

    & > .tooltip-content {
      font-size: 11px;
      font-weight: normal;
      color: white;
      line-height: 1.5;
    }
  }

  .item-tooltip::after {
    content: ' ';
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }

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
