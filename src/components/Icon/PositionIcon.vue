<template>
  <tooltip inlineBlock :content="tooltip" v-if="tooltip && tooltip !== ''">
    <div
      :class="{ selected: !!selected, disabled: !!disabled }"
      @click="!disabled && click()"
      class="position-icon-container"
    >
      <v-img
        :src="
          selected
            ? `/assets/positions/${position}.svg`
            : `/assets/positions/${position}-disabled.svg`
        "
        class="position-icon"
      />
    </div>
  </tooltip>
  <div
    :class="{ selected: !!selected, disabled: !!disabled }"
    @click="!disabled && click()"
    class="position-icon-container"
    v-else
  >
    <v-img
      :src="
        selected
          ? `/assets/positions/${position}.svg`
          : `/assets/positions/${position}-disabled.svg`
      "
      class="position-icon"
    />
  </div>
</template>

<script lang="ts">
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: { Tooltip },
})
export default class Position extends Vue {
  @Prop(String) private position!: string;
  @Prop(Boolean) private selected?: boolean;
  @Prop(Boolean) private disabled?: boolean;
  @Prop(String) private tooltip?: string;

  public click() {
    this.$emit('click');
  }
}
</script>

<style lang="scss" scoped>
.position-icon-container {
  display: inline-block;
  padding: 5px;
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

  .position-icon {
    display: table-cell;
    vertical-align: middle;
    min-width: 20px;
    min-height: 20px;
    max-width: 20px;
    max-height: 20px;
  }
}
</style>
