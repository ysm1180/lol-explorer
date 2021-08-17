<template>
  <tooltip
    :content="
      (percent >= 1)
        ? `승률: ${Math.floor((win / count) * 1000) / 10}%`
        : '데이터 부족'
    "
    inlineBlock
  >
    <div
      :class="{ selected: !!selected, disabled: !(percent >= 1) }"
      @click="(percent >= 1) && click()"
      class="position"
    >
      <v-img
        :src="
          selected
            ? `/assets/positions/${position}.svg`
            : `/assets/positions/${position}-disabled.svg`
        "
        class="position-image"
      />
      <div class="position-name">{{ name }}</div>
      <div class="position-percent" v-if="percent >= 1">{{ percent }}%</div>
      <div class="position-percent" v-else></div>
    </div>
  </tooltip>
</template>

<script lang="ts">
import { toPercentage } from '@/base/math';
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: { Tooltip },
})
export default class Position extends Vue {
  @Prop(String) private position!: string;
  @Prop(String) private name!: string;
  @Prop(Number) private count!: number;
  @Prop(Number) private win!: number;
  @Prop(Number) private totalCount!: number;
  @Prop(Boolean) private selected?: boolean;

  public get percent() {
    if (this.totalCount > 0) {
      return this.count ? toPercentage(this.count, this.totalCount) : 0;
    } else {
      return 0;
    }
  }

  public click() {
    this.$emit('click');
  }
}
</script>

<style lang="scss" scoped>
.position {
  display: inline-block;
  margin: 0 5px;
  padding: 5px 10px 5px 5px;
  cursor: pointer;
  background-color: #532929;
  color: #c7c7c7;

  &.selected {
    background-color: #e57c5b;
    color: white;
  }

  &.disabled {
    background-color: #5c4642;
    cursor: not-allowed;
  }

  .position-name {
    display: table-cell;
    width: 50px;
    vertical-align: middle;
    padding-left: 10px;
    font-size: 12px;
  }

  .position-image {
    display: table-cell;
    vertical-align: middle;
    min-width: 20px;
    min-height: 20px;
    max-width: 20px;
    max-height: 20px;
  }

  .position-percent {
    display: table-cell;
    text-align: right;
    vertical-align: middle;
    width: 40px;
    font-size: 12px;
  }
}
</style>
