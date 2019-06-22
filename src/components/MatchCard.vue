<template>
  <v-layout>
    {{match.gameId}}
  </v-layout>
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
