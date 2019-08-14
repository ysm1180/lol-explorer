<template>
  <div :class="{ selected: !!selected }" @click="click()" class="rune">
    <div class="rune-icons">
      <div class="rune-icon">
        <rune-icon
          :runeId="mainRuneId"
          :runeStyleId="mainRuneStyleId"
          notooltip
        />
      </div>
      <div class="rune-icon">
        <rune-style-icon :runeStyleId="subRuneStyleId" notooltip />
      </div>
    </div>

    <tooltip :content="`${count} 게임`" inlineBlock>
      <div class="description">
        픽률 : {{ pick }}%
        <br />
        승률 : {{ win }}%
      </div>
    </tooltip>
  </div>
</template>

<script lang="ts">
import RuneIcon from '@/components/Icon/RuneIcon.vue';
import RuneStyleIcon from '@/components/Icon/RuneStyleIcon.vue';
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: { RuneStyleIcon, RuneIcon, Tooltip },
})
export default class Rune extends Vue {
  @Prop(Number) private mainRuneStyleId!: number;
  @Prop(Number) private mainRuneId!: number;
  @Prop(Number) private subRuneStyleId!: number;
  @Prop(Number) private win!: number;
  @Prop(Number) private pick!: number;
  @Prop(Number) private count!: number;
  @Prop(Boolean) private selected?: boolean;

  public click() {
    this.$emit('click');
  }
}
</script>

<style lang="scss" scoped>
.rune {
  display: inline-block;
  margin: 0 2px;
  padding: 5px;
  cursor: pointer;
  background-color: #532929;
  color: #c7c7c7;

  &.selected {
    background-color: #e57c5b;
    color: white;
  }

  .rune-icons {
    display: inline-block;
    padding-left: 5px;
    font-size: 14px;

    .rune-icon {
      vertical-align: bottom;
      display: inline-block;
      border-radius: 50%;
      background-color: black;
    }
  }

  .description {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    width: 90px;
    font-size: 11px;
    font-weight: 600;
  }
}
</style>
