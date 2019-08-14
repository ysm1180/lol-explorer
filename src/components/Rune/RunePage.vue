<template>
  <div @click="click" class="modal-mask">
    <div class="modal-wrapper">
      <div @click.stop.prevent.self="" class="modal-container">
        <div class="rune-page mb-2">
          <v-img :src="`/assets/runes/${copyRune.primary.id}_back.jpg`" />
          <div class="pa-5 rune-content">
            <v-layout class="mr-5" d-inline>
              <champion-icon :championId="championId" circle large />
            </v-layout>
            <v-layout class="rune-type mr-5" d-inline-block>
              <v-layout>
                <v-flex v-bind:key="`${runeId}`" v-for="runeId in runeIdList">
                  <rune-style-icon
                    :hover="runeId !== copyRune.primary.id"
                    :runeStyleId="runeId"
                    @click="selectPrimaryRuneStyle(runeId)"
                    class="mb-5 cursor__pointer"
                    large
                  />
                </v-flex>
              </v-layout>
              <v-layout
                class="mb-4"
                justify-between-space
                v-bind:key="`${line}`"
                v-for="line in [0, 1, 2, 3]"
              >
                <v-layout>
                  <v-flex
                    v-bind:key="`${runeId}`"
                    v-for="runeId in Object.keys(
                      perks[copyRune.primary.id].slots[line].runes
                    )"
                  >
                    <rune-icon
                      :borderColor="runeBorderColor[copyRune.primary.id]"
                      :grayscale="runeId !== copyRune.primary.slots[line]"
                      :runeId="runeId"
                      :runeStyleId="copyRune.primary.id"
                      @click="selectPrimaryRune(runeId, line)"
                      class="cursor__pointer"
                      large
                    />
                  </v-flex>
                </v-layout>
              </v-layout>
            </v-layout>
            <v-layout class="rune-type" d-inline-block>
              <v-layout justify-between-space>
                <v-layout>
                  <v-flex
                    v-bind:key="`${runeId}`"
                    v-for="runeId in runeIdList"
                    v-show="runeId !== copyRune.primary.id"
                  >
                    <rune-style-icon
                      :hover="runeId !== copyRune.secondary.id"
                      :runeStyleId="runeId"
                      @click="selectSecondaryRuneStyle(runeId)"
                      class="mb-5 cursor__pointer"
                      large
                    />
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-layout
                justify-between-space
                v-bind:key="`${line}`"
                v-for="line in [1, 2, 3]"
              >
                <v-layout>
                  <v-flex
                    v-bind:key="`${runeId}`"
                    v-for="runeId in Object.keys(
                      perks[copyRune.secondary.id].slots[line].runes
                    )"
                  >
                    <rune-icon
                      :borderColor="runeBorderColor[copyRune.secondary.id]"
                      :grayscale="
                        !copyRune.secondary.slots.find(
                          (slot) => slot.slot === runeId
                        )
                      "
                      :runeId="runeId"
                      :runeStyleId="copyRune.secondary.id"
                      @click="selectSecondaryRune(runeId, line)"
                      class="mb-4 cursor__pointer"
                      large
                    />
                  </v-flex>
                </v-layout>
              </v-layout>

              <v-layout class="rune-type" d-inline-block>
                <v-layout justify-between-space>
                  <v-layout>
                    <v-flex
                      v-bind:key="`${runeId}`"
                      v-for="runeId in ['5008', '5005', '5007']"
                    >
                      <rune-icon
                        :grayscale="copyRune.stat[0] !== runeId"
                        :runeId="runeId"
                        @click="selectStatRune(runeId, 0)"
                        borderColor="yellow"
                        class="mb-2 cursor__pointer"
                        runeStyleId="5000"
                      />
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout justify-between-space>
                  <v-layout>
                    <v-flex
                      v-bind:key="`${runeId}`"
                      v-for="runeId in ['5008', '5002', '5003']"
                    >
                      <rune-icon
                        :grayscale="copyRune.stat[1] !== runeId"
                        :runeId="runeId"
                        @click="selectStatRune(runeId, 1)"
                        borderColor="yellow"
                        class="mb-2 cursor__pointer"
                        runeStyleId="5000"
                      />
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout justify-between-space>
                  <v-layout>
                    <v-flex
                      v-bind:key="`${runeId}`"
                      v-for="runeId in ['5001', '5002', '5003']"
                    >
                      <rune-icon
                        :grayscale="copyRune.stat[2] !== runeId"
                        :runeId="runeId"
                        @click="selectStatRune(runeId, 2)"
                        borderColor="yellow"
                        class="mb-2 cursor__pointer"
                        runeStyleId="5000"
                      />
                    </v-flex>
                  </v-layout>
                </v-layout>
              </v-layout>
            </v-layout>
          </div>
        </div>
        <v-layout d-block>
          <tooltip
            content="룬을 모두 선택해주세요."
            inline
            v-if="!isAvailableSave()"
          >
            <v-btn class="lighten-2 deep-orange white--text" disabled flat>
              SAVE
            </v-btn>
          </tooltip>
          <v-btn
            @click="save()"
            class="lighten-2 deep-orange white--text"
            flat
            v-else
          >
            SAVE
          </v-btn>
          <v-btn @click="click" class="grey white--text" flat>CANCEL</v-btn>
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ChampionIcon from '@/components/Icon/ChampionIcon.vue';
import RuneIcon from '@/components/Icon/RuneIcon.vue';
import RuneStyleIcon from '@/components/Icon/RuneStyleIcon.vue';
import Tooltip from '@/components/UI/Tooltip/Tooltip.vue';
import { ICustomRune } from '@/typings/rune';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: { Tooltip, ChampionIcon, RuneStyleIcon, RuneIcon },
})
export default class RunePage extends Vue {
  @Prop() private championId!: number;
  @Prop() private rune!: ICustomRune;
  private copyRune: ICustomRune = this.rune;
  private runeIdList: string[] = ['8000', '8100', '8200', '8300', '8400'];
  private runeBorderColor = {
    8000: 'yellow',
    8100: 'red',
    8200: 'purple',
    8300: 'blue',
    8400: 'green',
  };

  @Watch('rune')
  private onRuneChanged(val: ICustomRune, oldVal: ICustomRune) {
    this.copyRune = val;
  }

  get perks() {
    return this.$store.state.lolstatic.perks;
  }

  public save() {
    this.$emit('save', this.copyRune);
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
  width: 990px;
  height: 700px;
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

  .rune-content {
    position: absolute;
    top: 0;

    .rune-type {
      width: 250px;
      vertical-align: top;
    }
  }
}
</style>
