<template>
  <div v-show="isActive">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class Tab extends Vue {
  @Prop(String) private name!: string;
  @Prop({ type: Boolean, default: false }) private selected!: boolean;
  @Prop() private onselected?: () => void;
  public isActive: boolean = false;

  public mounted() {
    this.isActive = this.selected;
  }

  public created() {
    this.isActive = false;
  }

  public get href() {
    return '#' + this.name.toLowerCase().replace(/ /g, '-');
  }
}
</script>

<style scoped></style>
