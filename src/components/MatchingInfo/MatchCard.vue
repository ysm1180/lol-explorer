<template>
  <v-card height="100%">
    GameId: {{match.gameId}}
  </v-card>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class MatchCard extends Vue {
  @Prop() match: any

  mounted() {
  }
}
</script>
