<template>
  <v-layout align-center justify-center fill-height>
    <span v-if="status === 'WAITING_CLIENT'" class="display-1 font-weight-bold">롤 클라이언트를 실행해주세요</span>
    <span v-if="status === 'WAITING_LOGIN'" class="display-1 font-weight-bold">로그인을 기다리는중...</span>
  </v-layout>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class Home extends Vue {
  public mounted(): void {}

  get status() {
    return this.$store.state.connection.status;
  }
  get lcuData() {
    return this.$store.state.connection.lcuData;
  }
  get lcuSummoner() {
    return this.$store.state.connection.lcuSummoner;
  }
  get summoner() {
    return this.$store.state.connection.summoner;
  }
  get matches() {
    return this.$store.state.match.matches;
  }
}
</script>
