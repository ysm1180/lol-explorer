<template>
  <div @click="click" class="modal-mask">
    <div class="modal-wrapper">
      <div @click.stop.prevent.self="" class="modal-container">
        <div class="rune-page mb-2">
          <v-img
            :src="`/assets/runes/${copyRune.primary.id}_back.jpg`"
            class="back-image"
          />
          <div class="pa-5 rune-content">
            <v-layout class="mr-5" d-inline>
              <champion-icon :championId="championId" circle large />
            </v-layout>
            <rune-book
              :primaryRuneStyle="copyRune.primary.id"
              :primaryRunes="copyRune.primary.slots"
              :secondaryRuneStyle="copyRune.secondary.id"
              :secondaryRunes="
                copyRune.secondary.slots.map((slot) => slot.slot)
              "
              :statRunes="copyRune.stat"
              @clickPrimaryRune="selectPrimaryRune"
              @clickPrimaryRuneStyle="selectPrimaryRuneStyle"
              @clickSecondaryRune="selectSecondaryRune"
              @clickSecondaryRuneStyle="selectSecondaryRuneStyle"
              @clickStatRune="selectStatRune"
              containerWidth="250"
              hover
              large
              pointer
            />
          </div>
        </div>
        <v-layout d-block>
          <tooltip
            content="룬을 모두 선택해주세요."
            inline
            v-if="!isAvailableSave()"
          >
            <v-btn
              class="white--text"
              color="deep-orange lighten-2"
              depressed
              disabled
              tile
            >
              SAVE
            </v-btn>
          </tooltip>
          <v-btn
            @click="save()"
            class="white--text"
            color="deep-orange lighten-2"
            depressed
            tile
            v-else
          >
            <span v-if="saved">
              저장 완료
            </span>
            <span v-else>
              SAVE
            </span>
          </v-btn>
          <v-btn @click="click" class="grey white--text" depressed tile>
            CLOSE
          </v-btn>
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ChampionIcon from '@/components/Icon/ChampionIcon.vue';
import RuneIcon from '@/components/Icon/RuneIcon.vue';
import RuneStyleIcon from '@/components/Icon/RuneStyleIcon.vue';
import RuneBook from '@/components/Rune/RuneBook.vue';
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { CustomRuneData } from '@/typings/rune';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: { RuneBook, Tooltip, ChampionIcon, RuneStyleIcon, RuneIcon },
})
export default class RunePage extends Vue {
  @Prop() private championId!: number;
  @Prop() private rune!: CustomRuneData;
  private saved: boolean = false;
  private copyRune: CustomRuneData = this.rune;
  private runeIdList: string[] = ['8000', '8100', '8200', '8300', '8400'];
  private runeBorderColor = {
    8000: 'yellow',
    8100: 'red',
    8200: 'purple',
    8300: 'blue',
    8400: 'green',
  };

  @Watch('rune')
  private onRuneChanged(val: CustomRuneData, oldVal: CustomRuneData) {
    this.copyRune = val;
  }

  get perks() {
    return this.$store.state.lolstatic.perks;
  }

  public save() {
    this.$emit('save', this.copyRune);
    this.saved = true;
    setTimeout(() => {
      this.saved = false;
    }, 3000);
  }

  public click() {
    this.$emit('click');
  }

  public selectPrimaryRuneStyle(runeStyleId: string) {
    this.copyRune.primary.id = runeStyleId;
    this.copyRune.primary.slots = ['0', '0', '0', '0'];

    if (this.copyRune.secondary.id === runeStyleId) {
      this.copyRune.secondary.id = [
        '8000',
        '8100',
        '8200',
        '8300',
        '8400',
      ].filter((id) => id !== runeStyleId)[0];
      this.copyRune.secondary.slots = [];
    }
  }

  public selectPrimaryRune(runeId: string, line: number) {
    Vue.set(this.copyRune.primary.slots, line, runeId);
  }

  public selectSecondaryRuneStyle(runeStyleId: string) {
    this.copyRune.secondary.id = runeStyleId;
    this.copyRune.secondary.slots = [];
  }

  public selectSecondaryRune(runeId: string, line: number) {
    const lineSlot = this.copyRune.secondary.slots.find(
      (slot) => slot.line === line
    );
    if (lineSlot) {
      lineSlot.slot = runeId;
    } else {
      this.copyRune.secondary.slots.unshift({ slot: runeId, line });
      this.copyRune.secondary.slots = this.copyRune.secondary.slots.slice(0, 2);
    }
  }

  public selectStatRune(runeId: string, line: number) {
    Vue.set(this.copyRune.stat, line, runeId);
  }

  public isAvailableSave() {
    return (
      this.copyRune.primary.id !== '0' &&
      !this.copyRune.primary.slots.includes('0') &&
      this.copyRune.secondary.id !== '0' &&
      this.copyRune.secondary.slots.length === 2 &&
      !this.copyRune.stat.includes('0')
    );
  }
}
</script>
<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 780px;
  height: 545px;
  margin: 0px auto;
  padding: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.rune-page {
  position: relative;

  .back-image {
    background-color: #333;
    max-width: 760px;
  }

  .rune-content {
    position: absolute;
    top: 0;

    .rune-type {
      width: 250px;
      vertical-align: top;
    }
  }
}

.save-info {
  font-size: 12px;
  font-weight: bold;
  color: #ff5859;
}
</style>
