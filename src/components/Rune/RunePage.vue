<template>
  <v-layout fill-height>
    <v-flex fill-height>
      <v-layout column fill-height>
        <div>
          <v-layout fill-height>
            <v-btn
              icon v-for="perkId in perkIdList" v-bind:key="perkId"
              @click="copyPerk.primary.id=perkId"
              :color="perkId===copyPerk.primary.id?'orange':''" :outline="perkId===copyPerk.primary.id"
            >
              <v-img
                :src="`${lolstatic.perks.baseIconUrl}${lolstatic.perks[perkId].icon}`"
                class="perk-icon" :class="perkId===copyPerk.primary.id?'selected':''"
              />
            </v-btn>
          </v-layout>
        </div>
        <div v-for="line in [0, 1, 2, 3]" v-bind:key="line">
          <v-layout fill-height>
            <v-btn
              icon v-for="perkId in Object.keys(lolstatic.perks[copyPerk.primary.id].slots[line].runes)" v-bind:key="perkId"
              @click="copyPerk.primary[`slot${line}`] = perkId"
              :color="copyPerk.primary[`slot${line}`]===perkId?'orange':''" :outline="copyPerk.primary[`slot${line}`]===perkId"
            >
            <v-img
              :src="`${lolstatic.perks.baseIconUrl}${lolstatic.perks[copyPerk.primary.id].slots[line].runes[perkId].icon}`"
              class="perk-icon" :class="copyPerk.primary[`slot${line}`]===perkId?'selected':''"
            />
            </v-btn>
          </v-layout>
        </div>
      </v-layout>
    </v-flex>
    <v-flex fill-height>
      <v-layout column fill-height>
        <div>
          <v-layout fill-height>
            <v-btn
              icon v-for="perkId in perkIdList" v-bind:key="perkId"
              v-show="perkId !== copyPerk.primary.id"
              @click="copyPerk.secondary.id=perkId"
              :color="perkId===copyPerk.secondary.id?'orange':''" :outline="perkId===copyPerk.secondary.id"
            >
              <v-img
                :src="`${lolstatic.perks.baseIconUrl}${lolstatic.perks[perkId].icon}`"
                class="perk-icon" :class="perkId===copyPerk.secondary.id?'selected':''"
              />
            </v-btn>
          </v-layout>
        </div>
        <div v-for="line in [1, 2, 3]" v-bind:key="line">
          <v-layout fill-height>
            <v-btn
              icon v-for="perkId in Object.keys(lolstatic.perks[copyPerk.secondary.id].slots[line].runes)" v-bind:key="perkId"
              @click="copyPerk.secondary[`slot${line}`] = perkId"
              :color="copyPerk.secondary[`slot${line}`]===perkId?'orange':''" :outline="copyPerk.secondary[`slot${line}`]===perkId"
            >
            <v-img
              :src="`${lolstatic.perks.baseIconUrl}${lolstatic.perks[copyPerk.secondary.id].slots[line].runes[perkId].icon}`"
              class="perk-icon" :class="copyPerk.secondary[`slot${line}`]===perkId?'selected':''"
            />
            </v-btn>
          </v-layout>
        </div>
        <div>
          <v-layout fill-height>
            <v-btn
              icon v-for="perkId in ['5008', '5005', '5007']" v-bind:Key="perkId"
              @click="copyPerk.stat.stat1=perkId"
              :color="copyPerk.stat.stat1===perkId?'orange':''" :outline="copyPerk.stat.stat1===perkId"
            >
              <v-img
                :src="`${lolstatic.perks.baseIconUrl}${lolstatic.perks['5000'].slots[0].runes[perkId].icon}`"
                class="perk-icon" :class="copyPerk.stat.stat1===perkId?'selected':''"
              />
            </v-btn>
          </v-layout>
        </div>
        <div>
          <v-layout fill-height>
            <v-btn
              icon v-for="perkId in ['5008', '5002', '5003']" v-bind:Key="perkId"
              @click="copyPerk.stat.stat2=perkId"
              :color="copyPerk.stat.stat2===perkId?'orange':''" :outline="copyPerk.stat.stat2===perkId"
            >
              <v-img
                :src="`${lolstatic.perks.baseIconUrl}${lolstatic.perks['5000'].slots[0].runes[perkId].icon}`"
                class="perk-icon" :class="copyPerk.stat.stat2===perkId?'selected':''"
              />
            </v-btn>
          </v-layout>
        </div>
        <div>
          <v-layout fill-height>
            <v-btn
              icon v-for="perkId in ['5001', '5002', '5003']" v-bind:Key="perkId"
              @click="copyPerk.stat.stat3=perkId"
              :color="copyPerk.stat.stat3===perkId?'orange':''" :outline="copyPerk.stat.stat3===perkId"
            >
              <v-img
                :src="`${lolstatic.perks.baseIconUrl}${lolstatic.perks['5000'].slots[0].runes[perkId].icon}`"
                class="perk-icon" :class="copyPerk.stat.stat3===perkId?'selected':''"
              />
            </v-btn>
          </v-layout>
        </div>
        <v-btn @click="save">save</v-btn>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class ChampionInfoCard extends Vue {
  @Prop() public perk!: any;
  public copyPerk: any = this.perk;
  public perkIdList: any[] = ['8000', '8100', '8200', '8300', '8400'];

  @Watch('perk')
  public onPerkChange(to: any, from: any) {
    this.copyPerk = to;
  }

  get lolstatic() {
    return this.$store.state.lolstatic;
  }
  public save() {
    this.$emit('save', this.copyPerk);
  }
}
</script>
<style scoped>
.perk-icon {
  max-width: 30px;
  max-height: 30px;
  -webkit-filter: grayscale(100%);
  filter:black;
}
.perk-icon.selected, .perk-icon:hover {
  -webkit-filter: grayscale(0%);
  filter:none;
}
</style>
