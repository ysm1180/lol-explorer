<template>
  <div class="rune-book">
    <div
      :class="{ 'mr-4': !!large, 'mr-3': !large }"
      :style="{ width: `${containerWidth}px` }"
      class="d-inline-block vertical__top"
    >
      <v-layout>
        <v-flex
          class="text-xs-center"
          v-bind:key="`${runeId}`"
          v-for="runeId in runeIdList"
        >
          <rune-style-icon
            :class="{
              cursor__pointer: !!pointer,
              'mb-4': !!large,
              'mb-2': !large,
            }"
            :grayscale="grayscale && runeId !== primaryRuneStyle"
            :hover="hover && runeId !== primaryRuneStyle"
            :large="!!large"
            :runeStyleId="runeId"
            @click="selectPrimaryRuneStyle(runeId)"
          />
        </v-flex>
      </v-layout>
      <v-layout
        :class="{ 'mb-4': !!large, 'mb-2': !large }"
        justify-between-space
        v-bind:key="`${line}`"
        v-for="line in [0, 1, 2, 3]"
      >
        <v-layout>
          <v-flex
            class="text-xs-center"
            v-bind:key="`${runeId}`"
            v-for="runeId in getRuneIds(primaryRuneStyle, line)"
          >
            <rune-icon
              :borderColor="runeBorderColor[primaryRuneStyle]"
              :class="{ cursor__pointer: !!pointer }"
              :grayscale="runeId !== primaryRunes[line]"
              :large="!!large"
              :runeId="runeId"
              :runeStyleId="primaryRuneStyle"
              @click="selectPrimaryRune(runeId, line)"
            />
          </v-flex>
        </v-layout>
      </v-layout>
    </div>
    <div
      :style="{ width: `${containerWidth}px` }"
      class="d-inline-block vertical__top text-xs-center"
    >
      <v-layout justify-between-space>
        <v-layout>
          <v-flex
            class="text-xs-center"
            v-bind:key="`${runeId}`"
            v-for="runeId in runeIdList"
            v-show="runeId !== primaryRuneStyle"
          >
            <rune-style-icon
              :class="{
                cursor__pointer: !!pointer,
                'mb-4': !!large,
                'mb-2': !large,
              }"
              :hover="runeId !== secondaryRuneStyle"
              :large="!!large"
              :runeStyleId="runeId"
              @click="selectSecondaryRuneStyle(runeId)"
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
            class="text-xs-center"
            v-bind:key="`${runeId}`"
            v-for="runeId in getRuneIds(secondaryRuneStyle, line)"
          >
            <rune-icon
              :borderColor="runeBorderColor[secondaryRuneStyle]"
              :class="{
                cursor__pointer: !!pointer,
                'mb-4': !!large,
                'mb-2': !large,
              }"
              :grayscale="!secondaryRunes.find((slot) => slot === runeId)"
              :large="!!large"
              :runeId="runeId"
              :runeStyleId="secondaryRuneStyle"
              @click="selectSecondaryRune(runeId, line)"
            />
          </v-flex>
        </v-layout>
      </v-layout>

      <div
        :style="{ width: `${containerWidth}px` }"
        class="d-inline-block vertical__top"
      >
        <v-layout justify-between-space>
          <v-layout>
            <v-flex
              class="text-xs-center"
              v-bind:key="`${runeId}`"
              v-for="runeId in ['5008', '5005', '5007']"
            >
              <rune-icon
                :class="{ cursor__pointer: !!pointer }"
                :grayscale="statRunes[0] !== runeId"
                :runeId="runeId"
                @click="selectStatRune(runeId, 0)"
                borderColor="yellow"
                class="mb-2"
                runeStyleId="5000"
              />
            </v-flex>
          </v-layout>
        </v-layout>
        <v-layout justify-between-space>
          <v-layout>
            <v-flex
              class="text-xs-center"
              v-bind:key="`${runeId}`"
              v-for="runeId in ['5008', '5002', '5003']"
            >
              <rune-icon
                :class="{ cursor__pointer: !!pointer }"
                :grayscale="statRunes[1] !== runeId"
                :runeId="runeId"
                @click="selectStatRune(runeId, 1)"
                borderColor="yellow"
                class="mb-2"
                runeStyleId="5000"
              />
            </v-flex>
          </v-layout>
        </v-layout>
        <v-layout justify-between-space>
          <v-layout>
            <v-flex
              class="text-xs-center"
              v-bind:key="`${runeId}`"
              v-for="runeId in ['5001', '5002', '5003']"
            >
              <rune-icon
                :class="{ cursor__pointer: !!pointer }"
                :grayscale="statRunes[2] !== runeId"
                :runeId="runeId"
                @click="selectStatRune(runeId, 2)"
                borderColor="yellow"
                class="mb-2"
                runeStyleId="5000"
              />
            </v-flex>
          </v-layout>
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import RuneIcon from '../Icon/RuneIcon.vue';
import RuneStyleIcon from '../Icon/RuneStyleIcon.vue';

@Component({
  components: { RuneIcon, RuneStyleIcon },
})
export default class RuneBook extends Vue {
  @Prop() private primaryRuneStyle!: string;
  @Prop() private primaryRunes!: string[];
  @Prop() private secondaryRuneStyle!: string[];
  @Prop() private secondaryRunes!: string[];
  @Prop() private statRunes!: string[];
  @Prop(Boolean) private large?: boolean;
  @Prop(Boolean) private pointer?: boolean;
  @Prop(Boolean) private hover?: boolean;
  @Prop(Boolean) private grayscale?: boolean;
  @Prop() private containerWidth?: number;

  private runeIdList: string[] = ['8000', '8100', '8200', '8400', '8300'];
  private runeBorderColor = {
    8000: 'yellow',
    8100: 'red',
    8200: 'purple',
    8300: 'blue',
    8400: 'green',
  };

  public getRuneIds(runeStyle: number, line: number) {
    const values = Object.values(
      this.perks[runeStyle].slots[line].runes
    ) as Array<{ id: number; sort: number }>;
    values.sort((a, b) => a.sort - b.sort);
    return values.map((value) => value.id.toString());
  }

  public get perks() {
    return this.$store.state.lolstatic.perks;
  }

  private selectPrimaryRuneStyle(runeStyleId: string) {
    this.$emit('clickPrimaryRuneStyle', runeStyleId);
  }

  private selectPrimaryRune(runeId: string, line: number) {
    this.$emit('clickPrimaryRune', runeId, line);
  }

  private selectSecondaryRuneStyle(runeStyleId: string) {
    this.$emit('clickSecondaryRuneStyle', runeStyleId);
  }

  private selectSecondaryRune(runeId: string, line: number) {
    this.$emit('clickSecondaryRune', runeId, line);
  }

  private selectStatRune(runeId: string, line: number) {
    this.$emit('clickStatRune', runeId, line);
  }
}
</script>

<style scoped>
.rune-book {
  display: inline-block;
  vertical-align: top;
}
</style>
