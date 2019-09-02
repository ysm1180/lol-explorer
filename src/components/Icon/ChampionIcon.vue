<template>
  <div
    :class="{ small: !!small, large: !!large, extralarge: !!extralarge }"
    @click="click"
    class="champion-icon-container"
  >
    <tooltip :content="champion.name" v-if="champion">
      <v-img
        :class="{ circle: !!circle }"
        :src="champion ? champion.iconUrl : ''"
        :style="{ border: `3px solid ${borderColor} !important` }"
        class="champion-icon"
      >
        <span class="white--text champion-level" v-if="!!level">
          {{ level }}
        </span>
      </v-img>
      <v-layout
        :class="{ circle: !!circle }"
        align-center
        class="position-icon-container"
        justify-center
        v-if="position"
      >
        <v-img
          :src="`/assets/positions/${positionName}.svg`"
          class="position-icon"
        ></v-img>
      </v-layout>
      <div class="sub-text" v-if="subText !== undefined">
        {{ subText }}
      </div>
    </tooltip>
    <v-layout
      :class="{ circle: !!circle }"
      :style="{ border: `3px solid ${borderColor}` }"
      align-center
      class="champion-icon"
      justify-center
      v-else-if="position"
    >
      <v-img
        :src="`/assets/positions/${positionName}.svg`"
        class="position-icon"
      ></v-img>
    </v-layout>

    <v-img
      :class="{ circle: !!circle }"
      :style="{ border: `3px solid ${borderColor} !important` }"
      class="champion-icon"
      v-else
    ></v-img>
  </div>
</template>

<script lang="ts">
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { StaticChampionApiData } from '@/typings/static-data';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: { Tooltip },
})
export default class ChampionIcon extends Vue {
  @Prop(Number) private championId!: number;
  @Prop(Boolean) private circle?: boolean;
  @Prop(Number) private level?: number;
  @Prop(Boolean) private small?: boolean;
  @Prop(Boolean) private large?: boolean;
  @Prop(Boolean) private extralarge?: boolean;
  @Prop(String) private subText?: string;
  @Prop(String) private position?: string;
  @Prop(String) private borderColor?: string;

  public get champion() {
    return (
      (this.$store.state.lolstatic.champions[
        this.championId
      ] as StaticChampionApiData) || null
    );
  }

  public get positionName() {
    if (this.position) {
      if (this.position === 'TOP') {
        return 'top';
      } else if (this.position === 'JUNGLE') {
        return 'jungle';
      } else if (this.position === 'MIDDLE') {
        return 'mid';
      } else if (this.position === 'BOTTOM') {
        return 'adc';
      } else if (this.position === 'UTILITY') {
        return 'support';
      }
    }
  }

  public click() {
    this.$emit('click');
  }
}
</script>

<style lang="scss" scoped>
.champion-icon-container {
  display: inline-block;
  position: relative;
  vertical-align: top;
  text-align: left;

  &.small .champion-icon {
    min-width: 36px;
    min-height: 36px;
    max-width: 36px;
    max-height: 36px;
  }

  &.large .champion-icon {
    min-width: 64px;
    min-height: 64px;
    max-width: 64px;
    max-height: 64px;
  }

  &.extralarge .champion-icon {
    min-width: 96px;
    min-height: 96px;
    max-width: 96px;
    max-height: 96px;
  }

  .position-icon-container {
    position: absolute;
    left: 50%;
    bottom: -10px;
    transform: translateX(-50%);
    border-radius: 50%;
    background: rgba(#000, 0.5);
    padding: 3px;

    & > .position-icon {
      min-width: 15px;
      min-height: 15px;
      max-width: 15px;
      max-height: 15px;
    }
  }

  .champion-icon {
    vertical-align: top;

    min-width: 48px;
    min-height: 48px;
    max-width: 48px;
    max-height: 48px;

    background-color: #bdbdbd;

    .position-icon {
      min-width: 28px;
      min-height: 28px;
      max-width: 28px;
      max-height: 28px;
    }

    &.circle {
      border-radius: 50%;
    }

    .champion-level {
      position: absolute;
      left: 50%;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      padding: 0 5px;
      transform: translateX(-50%);
      border-radius: 50%;
      font-size: 9px;
      white-space: nowrap;
    }
  }

  .sub-text {
    padding: 2px 0;
    font-size: 12px;
    text-align: center;
  }
}
</style>
