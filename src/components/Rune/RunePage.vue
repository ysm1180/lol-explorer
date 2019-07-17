<template>
  <v-layout fill-height>
    <v-flex fill-height>
      <v-layout column fill-height>
        <div>
          <v-layout fill-height>
            <v-btn
              icon v-for="perkId in perkIdList" v-bind:key="perkId"
              @click="perk.primary.id=perkId"
              :color="perkId===perk.primary.id?'orange':''" :outline="perkId===perk.primary.id"
            >
              <v-img
                :src="`${lolstatic.perks.baseIconUrl}${lolstatic.perks[perkId].icon}`"
                class="perk-icon" :class="perkId===perk.primary.id?'selected':''"
              />
            </v-btn>
          </v-layout>
        </div>
        <div v-for="line in [0, 1, 2, 3]" v-bind:key="line">
          <v-layout fill-height>
            <v-btn
              icon v-for="perkId in Object.keys(lolstatic.perks[perk.primary.id].slots[line].runes)" v-bind:key="perkId"
              @click="perk.primary[`slot${line}`] = perkId"
              :color="perk.primary[`slot${line}`]===perkId?'orange':''" :outline="perk.primary[`slot${line}`]===perkId"
            >
            <v-img
              :src="`${lolstatic.perks.baseIconUrl}${lolstatic.perks[perk.primary.id].slots[line].runes[perkId].icon}`"
              class="perk-icon" :class="perk.primary[`slot${line}`]===perkId?'selected':''"
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
              v-show="perkId !== perk.primary.id"
              @click="perk.secondary.id=perkId"
              :color="perkId===perk.secondary.id?'orange':''" :outline="perkId===perk.secondary.id"
            >
              <v-img
                :src="`${lolstatic.perks.baseIconUrl}${lolstatic.perks[perkId].icon}`"
                class="perk-icon" :class="perkId===perk.secondary.id?'selected':''"
              />
            </v-btn>
          </v-layout>
        </div>
        <div v-for="line in [1, 2, 3]" v-bind:key="line">
          <v-layout fill-height>
            <v-btn
              icon v-for="perkId in Object.keys(lolstatic.perks[perk.secondary.id].slots[line].runes)" v-bind:key="perkId"
              @click="perk.secondary[`slot${line}`] = perkId"
              :color="perk.secondary[`slot${line}`]===perkId?'orange':''" :outline="perk.secondary[`slot${line}`]===perkId"
            >
            <v-img
              :src="`${lolstatic.perks.baseIconUrl}${lolstatic.perks[perk.secondary.id].slots[line].runes[perkId].icon}`"
              class="perk-icon" :class="perk.secondary[`slot${line}`]===perkId?'selected':''"
            />
            </v-btn>
          </v-layout>
        </div>
          <v-layout fill-height>
            <v-btn
              icon v-for="perkId in [5008, 5005, 5007]" v-bind:Key="perkId"
              @click="perk.stat.stat1=perkId"
              :color="perk.stat.stat1===perkId?'orange':''" :outline="perk.stat.stat1===perkId"
            >
              <v-img
                :src="`${lolstatic.perks.baseIconUrl}${lolstatic.perks[5000].slots[0].runes[perkId].icon}`"
                class="perk-icon" :class="perk.stat.stat1===perkId?'selected':''"
              />
            </v-btn>
          </v-layout>
        <div>
          </div>
          <v-layout fill-height>
            <v-btn
              icon v-for="perkId in [5008, 5002, 5003]" v-bind:Key="perkId"
              @click="perk.stat.stat2=perkId"
              :color="perk.stat.stat2===perkId?'orange':''" :outline="perk.stat.stat2===perkId"
            >
              <v-img
                :src="`${lolstatic.perks.baseIconUrl}${lolstatic.perks[5000].slots[0].runes[perkId].icon}`"
                class="perk-icon" :class="perk.stat.stat2===perkId?'selected':''"
              />
            </v-btn>
          </v-layout>
        <div>
          </div>
          <v-layout fill-height>
            <v-btn
              icon v-for="perkId in [5001, 5002, 5003]" v-bind:Key="perkId"
              @click="perk.stat.stat3=perkId"
              :color="perk.stat.stat3===perkId?'orange':''" :outline="perk.stat.stat3===perkId"
            >
              <v-img
                :src="`${lolstatic.perks.baseIconUrl}${lolstatic.perks[5000].slots[0].runes[perkId].icon}`"
                class="perk-icon" :class="perk.stat.stat3===perkId?'selected':''"
              />
            </v-btn>
          </v-layout>
        <div>
        </div>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class ChampionInfoCard extends Vue {
  public perkIdList: any[] = [8000, 8100, 8200, 8300, 8400];
  public perk: any = {
    primary: {
      id: 8000,
      slot0: 0,
      slot1: 0,
      slot2: 0,
      slot3: 0,
    },
    secondary: {
      id: 8100,
      slot1: 0,
      slot2: 0,
      slot3: 0,
    },
    stat: {
      stat1: 0,
      stat2: 0,
      stat3: 0,
    },
  };
  get lolstatic() {
    return this.$store.state.lolstatic;
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
