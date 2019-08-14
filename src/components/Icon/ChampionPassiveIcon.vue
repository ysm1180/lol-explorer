<template>
  <v-layout
    :class="{ small: !!small, large: !!large }"
    @click="click"
    class="champion-passive-icon-container"
    d-inline-block
  >
    <tooltip
      :content="passive.description"
      :title="passive.name"
      v-if="passive"
    >
      <v-img
        :class="{ circle: !!circle }"
        :src="passive ? passive.iconUrl : ''"
        class="champion-passive-icon grey darken-2"
      />
    </tooltip>
    <v-img
      :class="{ circle: !!circle }"
      class="champion-passive-icon grey darken-2"
      v-else
    />
  </v-layout>
</template>

<script lang="ts">
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { IStaticChampion } from '@/typings/static-data';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: { Tooltip },
})
export default class ChampionSpellIcon extends Vue {
  @Prop(Number) private championId!: number;
  @Prop(Boolean) private circle?: boolean;
  @Prop(Boolean) private small?: boolean;
  @Prop(Boolean) private large?: boolean;

  public get passive() {
    const champion =
      (this.$store.state.lolstatic.champions[
        this.championId
      ] as IStaticChampion) || null;
    if (champion) {
      return champion.passive;
    }

    return null;
  }

  public click() {
    this.$emit('click');
  }
}
</script>

<style lang="scss" scoped>
.champion-passive-icon-container {
  position: relative;
  vertical-align: top;
  text-align: left;

  &.small .champion-passive-icon {
    min-width: 36px;
    min-height: 36px;
    max-width: 36px;
    max-height: 36px;
  }

  &.large .champion-passive-icon {
    min-width: 64px;
    min-height: 64px;
    max-width: 64px;
    max-height: 64px;
  }

  .champion-passive-icon {
    vertical-align: top;

    min-width: 40px;
    min-height: 40px;
    max-width: 40px;
    max-height: 40px;

    &.circle {
      border-radius: 50%;
    }

    .champion-level {
      position: absolute;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      padding: 0 5px;
      font-size: 10px;
      color: white;
    }
  }
}
</style>
