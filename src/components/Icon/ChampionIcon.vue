<template>
  <div class="champion-icon-container"
    :class="{ small: !!small, large: !!large, extralarge: !!extralarge }"
    @click="click"
  >
    <tooltip :content="champion.name" v-if="champion">
      <v-img
        :class="{ circle: !!circle }"
        :src="champion ? champion.iconUrl : ''"
        class="champion-icon grey darken-2"
      >
        <span class="white--text font-size-tiny champion-level" v-if="!!level">
          {{ level }}
        </span>
      </v-img>
      <div class="sub-text" v-if="subText !== undefined">
        {{ subText }}
      </div>
    </tooltip>
    <v-img
      :class="{ circle: !!circle }"
      class="champion-icon grey darken-2"
      v-else
    ></v-img>
  </div>
</template>

<script lang="ts">
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { IStaticChampion } from '@/typings/static-data';
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

  public get champion() {
    return (
      (this.$store.state.lolstatic.champions[
        this.championId
      ] as IStaticChampion) || null
    );
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

  .champion-icon {
    vertical-align: top;

    min-width: 48px;
    min-height: 48px;
    max-width: 48px;
    max-height: 48px;

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
      font-size: 10px;
    }
  }
  .sub-text {
    padding: 2px 0;
    font-size: 12px;
    text-align: center;
  }
}
</style>
