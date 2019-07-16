<template>
  <v-layout fill-height>
    <v-flex fill-height>
      <v-layout column fill-height>
        <v-flex>
          <v-layout fill-height>
            <v-btn
              icon
              v-bind:key="perkId"
              v-for="perkId in [8000, 8100, 8200, 8300, 8400]"
            >
              <v-img
                :src="
                  `${lolstatic.perks.baseIconUrl}${
                    lolstatic.perks[perkId].icon
                  }`
                "
                style="max-width:30px;max-height:30px;"
              />
            </v-btn>
          </v-layout>
        </v-flex>
        <v-flex></v-flex>
      </v-layout>
    </v-flex>
    <v-flex fill-height>
      <v-layout column fill-height>
        <v-flex>
          <v-layout fill-height>
            <v-btn
              icon
              v-bind:key="perkId"
              v-for="perkId in [8000, 8100, 8200, 8300, 8400]"
            >
              <v-img
                :src="
                  `${lolstatic.perks.baseIconUrl}${
                    lolstatic.perks[perkId].icon
                  }`
                "
                style="max-width:30px;max-height:30px;"
              />
            </v-btn>
          </v-layout>
        </v-flex>
        <v-flex></v-flex>
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
  get lolstatic() {
    return this.$store.state.lolstatic;
  }
}
</script>
<style scoped></style>
