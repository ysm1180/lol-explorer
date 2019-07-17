<template>
  <div>
    <div class="tabs">
      <nav>
        <button
          @click="selectTab(tab)"
          :class="{ active: tab.isActive }"
          v-for="tab in tabs"
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
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Tabs extends Vue {
  private tabs: any[] = [];

  public mounted() {
    this.tabs = this.$children;
  }

  public selectTab(selectedTab: any) {
    this.tabs.forEach((tab) => {
      tab.isActive = tab.name === selectedTab.name;
    });
  }
}
</script>

<style scoped>
.tabs {
  margin-bottom: 5px;
}
.tabs button {
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
}

.tabs button:hover {
  color: black;
}

.tabs button.active {
  border-bottom: 3px solid darkorange;
  color: black;
}
</style>
