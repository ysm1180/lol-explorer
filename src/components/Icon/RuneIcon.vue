<template>
  <v-layout
    :class="{ tiny: !!tiny, small: !!small, large: !!large }"
    class="rune-icon-container"
    d-inline-block
    ref="container"
  >
    <tooltip :content="runeContent" :title="rune.name" html v-if="rune" center>
      <v-img
        style="margin:auto"
        :class="[backgroundColorClass, { grayscale: !!grayscale }, borderColorClass]"
        :src="rune ? rune.iconUrl : ''"
        class="rune-icon"
        @click="click()"
      />
    </tooltip>
  </v-layout>
</template>

<script lang="ts">
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { IStaticPerk, IStaticRune } from '@/typings/static-data';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: { Tooltip },
})
export default class RuneIcon extends Vue {
  @Prop() private runeStyleId!: number;
  @Prop() private runeId!: number;
  @Prop(Boolean) private tiny?: boolean;
  @Prop(Boolean) private small?: boolean;
  @Prop(Boolean) private large?: boolean;
  @Prop(Boolean) private grayscale?: boolean;
  @Prop() private backgroundColor?: string;
  @Prop() private borderColor?: string;

  public get backgroundColorClass() {
    if (this.backgroundColor) {
      return !this.backgroundColor.startsWith('#') && this.backgroundColor;
    } else {
      return '';
    }
  }

  public get borderColorClass() {
    if (this.borderColor) {
      return !this.borderColor.startsWith('#') && `border__${this.borderColor}`;
    } else {
      return '';
    }
  }

  public get runeContent() {
    return this.rune!.longDesc ? this.rune!.longDesc : this.rune!.shortDesc;
  }

  public get rune() {
    const slots = (this.$store.state.lolstatic.perks[
      this.runeStyleId
    ] as IStaticPerk).slots;

    let rune: IStaticRune | null = null;
    for (const slot of slots) {
      if (slot.runes[this.runeId]) {
        rune = slot.runes[this.runeId];
        break;
      }
    }

    return rune;
  }

  public click() {
    this.$emit('click');
  }
}
</script>

<style lang="scss" scoped>
.rune-icon-container {
  position: relative;
  vertical-align: top;
  text-align: left;
  box-sizing: content-box;

  &.tiny .rune-icon {
    min-width: 16px;
    min-height: 16px;
    max-width: 16px;
    max-height: 16px;
  }

  &.small .rune-icon {
    min-width: 23px;
    min-height: 23px;
    max-width: 23px;
    max-height: 23px;
  }

  &.large .rune-icon {
    min-width: 48px;
    min-height: 48px;
    max-width: 48px;
    max-height: 48px;
  }

  .rune-icon {
    position: relative;
    vertical-align: top;

    min-width: 32px;
    min-height: 32px;
    max-width: 32px;
    max-height: 32px;
    border-radius: 50%;

    &.border__yellow:before {
      box-shadow: inset 0 0 0 2px #C8AA6F;
    }

    &.border__red:before {
      box-shadow: inset 0 0 0 2px #DC4747;
    }

    &.border__purple:before {
      box-shadow: inset 0 0 0 2px #9FA9FC;
    }

    &.border__blue:before {
      box-shadow: inset 0 0 0 2px #48B3BE;
    }

    &.border__green:before {
      box-shadow: inset 0 0 0 2px #A1D586;
    }

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      border: solid 0 transparent;
      border-radius: 50%;
    }

    &.grayscale {
      filter: grayscale(100%);
    }
  }
}
</style>
