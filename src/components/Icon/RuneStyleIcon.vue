<template>
  <div
    :class="{ small: !!small, large: !!large }"
    class="rune-style-icon-container"
    ref="container"
  >
    <tooltip :title="rune.name" html v-if="rune" center>
      <v-img
        class="rune-style-icon"
        :class="[backgroundColorClass, { hover: !!hover }]"
        :src="`/assets/runes/${runeStyleId}.svg`"
        @click="click()"
        contain
      />
    </tooltip>
  </div>
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
  display: inline-block;
  position: relative;
  vertical-align: top;
  text-align: left;

  &.small .rune-style-icon {
    min-width: 15px;
    min-height: 15px;
    max-width: 15px;
    max-height: 15px;
  }

  &.large .rune-style-icon {
    min-width: 32px;
    min-height: 32px;
    max-width: 32px;
    max-height: 32px;
  }

  .rune-style-icon {
    position: relative;
    vertical-align: top;
    overflow: hidden;

    min-width: 23px;
    min-height: 23px;
    max-width: 23px;
    max-height: 23px;

    &.hover {
      filter: brightness(0.5);
      &:hover {
        filter: brightness(1);
      }
    }
  }
}
</style>
