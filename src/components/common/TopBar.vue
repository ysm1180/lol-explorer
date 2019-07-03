<template>
  <v-toolbar absolute id="top-bar" dark dense height=40>
    <v-layout fill-height align-center>
      <v-flex class="white--text fill-height arrow cursor-pointer" @click="$router.go(-1)">
        <v-btn small icon><v-icon small>arrow_back_ios</v-icon></v-btn>
      </v-flex>
      <v-flex class="white--text fill-height arrow cursor-pointer" @click="$router.go(1)">
        <v-btn small icon><v-icon small>arrow_forward_ios</v-icon></v-btn>
      </v-flex>
    </v-layout>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class TopBar extends Vue {
  @Prop() season: any
  @Prop() queueType!: string

  mounted() {
  }
}
</script>
<style scoped>
.cursor-pointer {
  cursor: pointer;
  width: 100%;
}
.arrow {
  max-width: 50px;
}
</style>