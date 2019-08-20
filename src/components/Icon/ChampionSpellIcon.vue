<template>
  <v-layout
    :class="{ small: !!small, large: !!large }"
    @click="click"
    class="champion-spell-icon-container"
    d-inline-block
  >
    <tooltip :content="spellContent" :title="spell.name" html v-if="spell">
      <v-img
        :class="{ circle: !!circle }"
        :src="spell ? spell.iconUrl : ''"
        class="champion-spell-icon grey darken-2"
      >
        <span class="white--text font-size-tiny spell-name" v-if="!!spellName">
          {{ spellName }}
        </span>
      </v-img>
    </tooltip>
    <v-img
      :class="{ circle: !!circle }"
      class="champion-spell-icon grey darken-2"
      v-else
    ></v-img>
  </v-layout>
</template>

<script lang="ts">
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import {StaticChampionApiData} from '@/typings/static-data';
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
             components: {Tooltip},
           })
export default class ChampionSpellIcon extends Vue {
  @Prop(Number) private championId!: number;
  @Prop(String) private spellName!: string;
  @Prop(Boolean) private circle?: boolean;
  @Prop(Boolean) private small?: boolean;
  @Prop(Boolean) private large?: boolean;

  public get spell() {
    const champion =
      (this.$store.state.lolstatic.champions[
        this.championId
        ] as StaticChampionApiData) || null;
    if (champion) {
      if (this.spellName === 'Q') {
        return champion.spells[0];
      } else if (this.spellName === 'W') {
        return champion.spells[1];
      } else if (this.spellName === 'E') {
        return champion.spells[2];
      } else if (this.spellName === 'R') {
        return champion.spells[3];
      }
    }

    return null;
  }

  public get spellContent() {
    if (this.spell) {
      let content = `<span class="grey--text">재사용 대기시간: ${this.spell.cooldownBurn}초</span><br />`;
      content += `<span class="grey--text">소모: ${this.spell.resource || ''}</span><br />`;
      content += `<span class="grey--text">사거리: ${this.spell.rangeBurn}</span><br /><br />`;
      content += this.spell.tooltip;
      if (this.spell.secret) {
        content += '<br /><br /><span class="deep-orange--text">"?"는 라이엇 API 에서 제공하지 않는 값입니다. ';
        content += '정확한 값은 롤 클라이언트에서 확인할 수 있습니다.</span>';
      }
      return content;
    } else {
      return '';
    }
  }

  public click() {
    this.$emit('click');
  }
}
</script>

<style lang="scss" scoped>
.champion-spell-icon-container {
  position: relative;
  vertical-align: top;
  text-align: left;

  &.small .champion-spell-icon {
    min-width: 36px;
    min-height: 36px;
    max-width: 36px;
    max-height: 36px;
  }

  &.large .champion-spell-icon {
    min-width: 64px;
    min-height: 64px;
    max-width: 64px;
    max-height: 64px;
  }

  .champion-spell-icon {
    vertical-align: top;

    min-width: 40px;
    min-height: 40px;
    max-width: 40px;
    max-height: 40px;

    &.circle {
      border-radius: 50%;
    }

    .spell-name {
      position: absolute;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      padding: 5px;
      font-size: 10px;
      color: white;

      user-select: none;
    }
  }
}
</style>
