<template>
  <v-layout
    :class="{ small: !!small }"
    class="rune-icon-container"
    d-inline-block
    ref="container"
  >
    <tooltip :content="runeContent" :title="rune.name" html v-if="rune">
      <v-img :src="rune ? rune.iconUrl : ''" class="rune-icon grey lighten-2" />
    </tooltip>
    <v-img class="rune-icon grey" v-else />
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
  @Prop(Boolean) private small?: boolean;

  public get runeContent() {
    return `${this.rune!.longDesc}`;
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
}
</script>

<style lang="scss" scoped>
.rune-icon-container {
  position: relative;
  vertical-align: top;
  text-align: left;

  &.small .rune-icon {
    min-width: 16px;
    min-height: 16px;
    max-width: 16px;
    max-height: 16px;
  }

  .rune-icon {
    vertical-align: top;

    min-width: 23px;
    min-height: 23px;
    max-width: 23px;
    max-height: 23px;
    border-radius: 50%;
  }
}
</style>
