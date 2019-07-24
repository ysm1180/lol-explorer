<template>
  <v-layout class="item-icon-container" d-inline-block ref="container">
    <div
      :class="{ bottom: isBottom, top: !isBottom }"
      class="tooltip-container"
      v-if="item && isHover"
    >
      <div class="item-tooltip">
        <div class="tooltip-title">
          {{ item.name }}
        </div>
        <div class="tooltip-content html-content" v-html="itemContent"></div>
      </div>
    </div>
    <v-img
      :src="item ? item.iconUrl : ''"
      @mouseenter="hover()"
      @mouseleave="leave()"
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
  private isBottom: boolean = false;

  public hover() {
    this.isHover = true;
    this.isBottom = false;

    if (this.item) {
      const computing = document.createElement('div');
      computing.style.verticalAlign = 'top';
      computing.style.opacity = '0';
      computing.innerHTML = `<div style="width:max-content;max-width:330px;padding:10px;">
        <div>
          <div style="font-size:13px;font-weight:bold;margin-bottom:5px;">
            ${this.item.name}
          </div>
          <div style="font-size:11px;font-weight:normal;line-height:1.5;">
            ${this.itemContent}
          </div>
        </div>
      </div>`;
      document.body.appendChild(computing);
      const rect = (this.$refs.container as Element).getBoundingClientRect();
      if (rect.top - (computing.offsetHeight + 20 + 48) < 0) {
        this.isBottom = true;
      }
      document.body.removeChild(computing);
    }
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

<style lang="scss" scoped>
.item-icon-container {
  position: relative;
  vertical-align: top;
  text-align: left;

  .tooltip-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background-color: #222;
    color: white;
    width: max-content;
    max-width: 330px;
    padding: 10px;
    z-index: 6;

    .item-tooltip {
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

    &.top {
      top: -70%;
      transform: translateX(-50%) translateY(-100%);

      &::after {
        content: ' ';
        position: absolute;
        top: 100%; /* At the bottom of the tooltip */
        left: 50%;
        margin-left: -8px;
        border-width: 8px;
        border-style: solid;
        border-color: #222 transparent transparent transparent;
      }
    }

    &.bottom {
      top: 160%;

      &::after {
        content: ' ';
        position: absolute;
        bottom: 100%; /* At the bottom of the tooltip */
        left: 50%;
        margin-left: -8px;
        border-width: 8px;
        border-style: solid;
        border-color: transparent transparent #222 transparent;
      }
    }
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
