<template>
  <div>
    <div
      :class="{ 'align-center': !!alignCenter, 'align-right': !!alignRight }"
      class="tabs"
    >
      <nav>
        <button
          :class="{ active: tab.isActive }"
          @click="selectTab(tab)"
          v-bind:key="index"
          v-for="(tab, index) in tabs"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <div class="tabs-details">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Tabs extends Vue {
  @Prop() private onSelected?: (index: number) => void;
  @Prop(Boolean) private alignCenter?: boolean;
  @Prop(Boolean) private alignRight?: boolean;

  private tabs: any[] = [];

  public mounted() {
    this.tabs = this.$children;
  }

  public selectTab(selectedTab: any) {
    this.tabs.forEach((tab, index) => {
      tab.isActive = tab.name === selectedTab.name;
      if (tab.isActive) {
        if (this.onSelected) {
          this.onSelected(index);
        }
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  margin-bottom: 5px;

  &.align-center {
    text-align: center;
  }

  &.align-right {
    text-align: right;
  }

  button {
    display: inline-block;
    margin: 0;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: bold;
    color: gray;
    text-decoration: none;
    border: none;
    background-color: transparent;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.25s;
    outline: none;

    &:hover {
      color: black;
    }

    &.active {
      border-bottom: 3px solid darkorange;
      color: black;
    }
  }
}
</style>
