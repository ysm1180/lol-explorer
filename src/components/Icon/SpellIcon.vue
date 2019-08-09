<template>
  <v-layout
    :class="{ small: !!small, large: !!large }"
    class="spell-icon-container"
    d-inline-block
    ref="container"
  >
    <tooltip :content="spellContent" :title="spell.name" html v-if="spell">
      <v-img :src="spell ? spell.iconUrl : ''" class="spell-icon grey" />
    </tooltip>
    <v-img class="spell-icon grey" v-else />
  </v-layout>
</template>

<script lang="ts">
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { IStaticSpell } from '@/typings/static-data';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: { Tooltip },
})
export default class SpellIcon extends Vue {
  @Prop() private spellId!: number;
  @Prop(Boolean) private small?: boolean;
  @Prop(Boolean) private large?: boolean;

  public get spellContent() {
    return `${this.spell.description}<br /><br />재사용 대기시간 : ${
      this.spell.cooldown
    }초`;
  }

  public get spell() {
    return (
      (this.$store.state.lolstatic.spells[this.spellId] as IStaticSpell) || null
    );
  }
}
</script>

<style lang="scss" scoped>
.spell-icon-container {
  position: relative;
  vertical-align: top;
  text-align: left;

  &.small .spell-icon {
    min-width: 16px;
    min-height: 16px;
    max-width: 16px;
    max-height: 16px;
  }

  &.large .spell-icon {
    min-width: 32px;
    min-height: 32px;
    max-width: 32px;
    max-height: 32px;
  }

  .spell-icon {
    vertical-align: top;

    min-width: 23px;
    min-height: 23px;
    max-width: 23px;
    max-height: 23px;
    border-radius: 3px;
  }
}
</style>
