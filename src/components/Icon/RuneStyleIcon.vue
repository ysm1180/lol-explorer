<template>
  <v-layout
    :class="{ small: !!small }"
    class="rune-style-icon-container"
    d-inline-block
    ref="container"
  >
    <tooltip :title="perk.name" html v-if="perk">
      <v-img :src="perk ? perk.iconUrl : ''" class="rune-style-icon" />
    </tooltip>
    <v-img class="rune-style-icon grey" v-else />
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

  public get perk() {
    return this.$store.state.lolstatic.perks[
      this.runeStyleId
    ] as IStaticPerk | null;
  }
}
</script>

<style lang="scss" scoped>
.rune-style-icon-container {
  position: relative;
  vertical-align: top;
  text-align: left;

  &.small .rune-style-icon {
    min-width: 15px;
    min-height: 15px;
    max-width: 15px;
    max-height: 15px;
  }

  .rune-style-icon {
    vertical-align: top;

    min-width: 22px;
    min-height: 22px;
    max-width: 22px;
    max-height: 22px;
    border-radius: 50%;
  }
}
</style>
