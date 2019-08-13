<template>
  <v-layout
    :class="{ small: !!small, large: !!large }"
    class="rune-style-icon-container"
    ref="container"
  >
    <tooltip :title="rune.name" html v-if="rune" center>
      <div class="d-inline-block rune-style-icon">
        <v-img
          class="image"
          :class="[backgroundColorClass, { hover: !!hover }]"
          :src="`/assets/runes/${runeStyleId}.svg`"
          @click="click()"
          :width="!!large ? 32 : 23"
          :height="!!large ? 32 : 23"
          contain
        />
      </div>
    </tooltip>
  </v-layout>
</template>

<script lang="ts">
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { IStaticPerk } from '@/typings/static-data';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: { Tooltip },
})
export default class RuneStyleIcon extends Vue {
  @Prop() private runeStyleId!: number;
  @Prop(Boolean) private small?: boolean;
  @Prop(Boolean) private large?: boolean;
  @Prop(Boolean) private hover?: boolean;
  @Prop() private backgroundColor?: string;

  public get backgroundColorClass() {
    if (this.backgroundColor) {
      return !this.backgroundColor.startsWith('#') && this.backgroundColor;
    } else {
      return '';
    }
  }

  public get rune() {
    return this.$store.state.lolstatic.perks[
      this.runeStyleId
    ] as IStaticPerk | null;
  }

  public click() {
    this.$emit('click');
  }
}
</script>

<style lang="scss" scoped>
.rune-style-icon-container {
  position: relative;
  vertical-align: top;
  text-align: left;
  display: inline-block;
  &.small .rune-style-icon {
    min-width: 15px;
    min-height: 15px;
    max-width: 15px;
    max-height: 15px;
  }

  &.large .rune-style-icon {
    width: 32px;
    height: 32px;
  }

  .rune-style-icon {
    position: relative;
    vertical-align: top;
    overflow: hidden;

    width: 23px;
    height: 23px;

    .image {
      &.hover {
        filter: brightness(0.5);
        &:hover {
          filter: brightness(1);
        }
      }
    }
  }
}
</style>
