<template>
  <v-layout class="champion-icon-container" d-inline-block ref="container">
    <div
      :class="{ bottom: isBottom, top: !isBottom }"
      class="tooltip-container"
      v-if="champion && isHover"
    >
      <div class="champion-tooltip">
        <div class="tooltip-content">
          {{ champion.name }}
        </div>
      </div>
    </div>
    <v-img
      :class="{ circle: !!circle }"
      :src="champion ? champion.iconUrl : ''"
      @mouseenter="hover()"
      @mouseleave="leave()"
      class="champion-icon grey darken-2"
    />
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IStaticChampion } from '@/typings/static-data';

@Component
export default class ChampionIcon extends Vue {
  @Prop(Number) private championId!: number;
  @Prop(Boolean) private circle?: boolean;
  private isHover: boolean = false;
  private isBottom: boolean = false;

  public hover() {
    this.isHover = true;
    this.isBottom = false;

    const computing = document.createElement('div');
    computing.style.opacity = '0';
    computing.style.padding = '5px 10px';
    computing.innerHTML = `<div style="font-size: 11px;font-weight: normal;line-height: 1.5;">${this.champion.name}</div>`;
    document.body.appendChild(computing);
    const rect = (this.$refs.container as Element).getBoundingClientRect();
    if (rect.top - (computing.offsetHeight + 10 + 48) < 0) {
      this.isBottom = true;
    }
    document.body.removeChild(computing);
  }

  public leave() {
    this.isHover = false;
  }

  public get champion() {
    return (
      (this.$store.state.lolstatic.champions[
        this.championId
      ] as IStaticChampion) || null
    );
  }
}
</script>

<style lang="scss" scoped>
.champion-icon-container {
  position: relative;
  vertical-align: top;
  text-align: left;

  .tooltip-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    width: max-content;
    padding: 5px 10px;
    z-index: 6;

    .champion-tooltip {
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

      &::after {
        content: ' ';
        position: absolute;
        top: 100%; /* At the bottom of the tooltip */
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #333 transparent transparent transparent;
      }
    }

    &.bottom {
      top: 110%;

      &::after {
        content: ' ';
        position: absolute;
        top: -35%; /* At the bottom of the tooltip */
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent #333 transparent;
      }
    }
  }

  .champion-icon {
    vertical-align: top;

    min-width: 48px;
    min-height: 48px;
    max-width: 48px;
    max-height: 48px;

    &.circle {
      border-radius: 50%;
    }
  }
}
</style>
