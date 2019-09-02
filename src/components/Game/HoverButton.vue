<template>
  <tooltip
    :content="
      data && `${data.count}
        게임 / 승률 :
        ${toPercentage(data.win, data.count)}%`
    "
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    center
  >
    <div class="hover-buttons">
      <div v-if="!hover && data">
        {{ data.count }}
        게임 / 승률 :
        {{ toPercentage(data.win, data.count) }}%
      </div>
      <div v-else-if="hover && data">
        <v-btn dark depressed x-small class="mr-1" @click="show">보기</v-btn>
        <v-btn dark depressed x-small color="#E57C5B" @click="apply">
          적용
        </v-btn>
      </div>
    </div>
  </tooltip>
</template>

<script lang="ts">
import { toPercentage } from '@/base/math';
import { Component, Prop, Vue } from 'vue-property-decorator';
import Tooltip from '../UI/Tooltip/Tooltip.vue';

@Component({
  components: { Tooltip },
})
export default class HoverButton extends Vue {
  @Prop() private data!: {
    win: number;
    count: number;
  };
  private hover: boolean = false;

  public toPercentage(molecular: number, denominator: number) {
    return toPercentage(molecular, denominator);
  }

  public apply() {
    this.$emit('apply');
  }

  public show() {
    this.$emit('show');
  }
}
</script>

<style lang="scss" scoped>
.hover-buttons {
  padding: 10px;
  cursor: pointer;
  width: 150px;
  height: 40px;

  &:hover {
    background-color: rgba(#ffffff, 0.5);
  }
}
</style>
