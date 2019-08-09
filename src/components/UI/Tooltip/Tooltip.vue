<template>
  <v-layout
    :class="{ 'd-inline-block': !!inlineBlock, 'd-inline': !!inline, 'justify-center': !!center }"
    class="tooltip-layout"
    ref="container"
  >
    <div
      :class="{ bottom: isBottom, top: !isBottom, indent: isIndent }"
      class="tooltip-container"
      v-if="isHover"
    >
      <div class="tooltip">
        <div class="tooltip-title" v-if="title">
          {{ title }}
        </div>
        <div
          class="tooltip-content html-content"
          v-html="content"
          v-if="!!html"
        ></div>
        <div class="tooltip-content" v-else>{{ content }}</div>
      </div>
    </div>
    <div
      :class="{ 'full-width': !!fullWidth }"
      @mouseenter="hover()"
      @mouseleave="leave()"
      class="d-inline-block"
    >
      <slot></slot>
    </div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Tooltip extends Vue {
  @Prop() private title!: string;
  @Prop() private content!: string;
  @Prop(Boolean) private html?: boolean;
  @Prop(Boolean) private inline?: boolean;
  @Prop(Boolean) private inlineBlock?: boolean;
  @Prop(Boolean) private fullWidth?: boolean;
  @Prop(Boolean) private center?: boolean;
  private isHover: boolean = false;
  private isBottom: boolean = false;
  private isIndent: boolean = false;

  public hover() {
    this.isHover = true;
    this.isBottom = false;
    this.isIndent = false;

    const computing = document.createElement('div');
    computing.style.position = 'absolute';
    computing.style.verticalAlign = 'top';
    computing.style.opacity = '0';
    computing.innerHTML = `<div style="width:max-content;max-width:330px;padding:10px;">
        <div>
          <div style="font-size:13px;font-weight:bold;margin-bottom:5px;">
            ${this.title}
          </div>
          <div style="font-size:11px;font-weight:normal;line-height:1.5;">
            ${this.content}
          </div>
        </div>
      </div>`;
    document.body.appendChild(computing);

    const rect = (this.$refs.container as Element).getBoundingClientRect();
    if (rect.top - (computing.offsetHeight + 20 + 48) < 0) {
      this.isBottom = true;
    }
    if (rect.left + rect.width / 2 - computing.offsetWidth / 2 < 0) {
      this.isIndent = true;
    }
    document.body.removeChild(computing);
  }

  public leave() {
    this.isHover = false;
  }
}
</script>

<style lang="scss" scoped>
.tooltip-layout {
  position: relative;

  .full-width {
    width: 100%;
  }

  .tooltip-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    width: max-content;
    max-width: 330px;
    padding: 10px;
    z-index: 6;

    .tooltip {
      & > .tooltip-title {
        font-size: 13px;
        font-weight: bold;
        color: orange;
        margin-bottom: 5px;
      }

      & > .tooltip-content {
        font-size: 11px;
        font-weight: normal;
        color: white;
        line-height: 1.5;
      }
    }

    &.top {
      top: 0;
      transform: translateX(-50%) translateY(calc(-100% - 10px));

      &.indent {
        left: 0;
        transform: translateY(calc(-100% - 10px));

        &:after {
          left: 20px;
        }
      }

      &::after {
        content: ' ';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #333 transparent transparent transparent;
      }
    }

    &.bottom {
      bottom: 0;
      transform: translateX(-50%) translateY(calc(100% + 10px));

      &.indent {
        left: 0;
        transform: translateY(calc(100% + 10px));

        &:after {
          left: 20px;
        }
      }

      &::after {
        content: ' ';
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent #333 transparent;
      }
    }
  }
}
</style>
