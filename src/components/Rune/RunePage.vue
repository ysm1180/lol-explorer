<template>
  <v-layout fill-height>
    <v-flex fill-height>
      <v-layout column fill-height>
        <v-flex>
          <v-layout fill-height>
            <v-btn icon v-for="perk in lolstatic.perks" v-bind:key="perk.id">
              <v-img
                :src="`https://ddragon.leagueoflegends.com/cdn/img/${perk.icon}`"
                style="max-width:30px;max-height:30px;"
              />
            </v-btn>
          </v-layout>
        </v-flex>
        <v-flex>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex fill-height>
      <v-layout column fill-height>
        <v-flex>
          <v-layout fill-height>
            <v-btn icon v-for="perk in lolstatic.perks" v-bind:key="perk.id">
              <v-img
                :src="`https://ddragon.leagueoflegends.com/cdn/img/${perk.icon}`"
                style="max-width:30px;max-height:30px;"
              />
            </v-btn>
          </v-layout>
        </v-flex>
        <v-flex>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class ChampionInfoCard extends Vue {
  get lolstatic() {
    return this.$store.state.lolstatic;
  }
}
</script>
<style scoped>

</style>