<template>
  <v-layout align-center justify-center fill-height>
    <span v-if="!champselecting" class="display-1 font-weight-bold">챔피언 선택중이 아닙니다.</span>
    <v-layout v-else column fill-height justify-center align-center>
      <v-flex v-for="(info,index) in myTeamInfo" v-bind:key="index">
        {{info}}
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import { IpcMessageEvent, ipcRenderer } from 'electron';

const ENDPOINT = 'http://localhost:3000';
@Component({
  components: {},
})
export default class Home extends Vue {
  public champselecting: boolean = false;
  public myTeam: any[] = [];
  public myTeamName: any[] = [];
  public myTeamInfo: any[] = [];

  public async created() {
    ipcRenderer.on('lcu-api-message', async (event: any, data: any) => {
      if (data.uri === '/lol-gameflow/v1/gameflow-phase') {
        this.init();
      }
    });
    this.init();
  }

  public async init() {
    await this.checkIfChampselecting();
    if (this.champselecting) {
      await this.checkMyTeam();
      await this.checkMyTeamName();
      this.$nextTick(async () => {
        await this.checkMyTeamInfo();
      });
    }
  }
  public async checkIfChampselecting() {
    const response = await axios.get(
      `${this.lcuData.protocol}://${this.lcuData.address}:${this.lcuData.port}/lol-gameflow/v1/gameflow-phase`,
      {
        headers: { Authorization: `Basic ${btoa(`${this.lcuData.username}:${this.lcuData.password}`)}` },
      }
    );
    if (response.data === 'ChampSelect') {
      this.champselecting = true;
    } else {
      this.champselecting = false;
    }
  }
  public async checkMyTeam() {
    const response = await axios.get(
      `${this.lcuData.protocol}://${this.lcuData.address}:${this.lcuData.port}/lol-champ-select/v1/session`,
      {
        headers: { Authorization: `Basic ${btoa(`${this.lcuData.username}:${this.lcuData.password}`)}` },
      }
    );
    this.myTeam = response.data.myTeam;
  }
  public async checkMyTeamName() {
    for (const summoner of this.myTeam) {
      if (summoner.summonerId !== 0) {
        const baseUrl = `${this.lcuData.protocol}://${this.lcuData.address}:${this.lcuData.port}`;
        const response = await axios.get(
          `${baseUrl}/lol-summoner/v1/summoners/${summoner.summonerId}`,
          {
            headers: { Authorization: `Basic ${btoa(`${this.lcuData.username}:${this.lcuData.password}`)}` },
          }
        );
        if (!this.myTeamName.includes(response.data.displayName)) {
          this.myTeamName.push(response.data.displayName);
        }
      }
    }
  }
  public async checkMyTeamInfo() {
    for (const name of this.myTeamName) {
      const response = await axios.get(`${ENDPOINT}/summoner/${name}`);
      this.myTeamInfo.push(response.data);
    }
  }

  get lcuData() {
    return this.$store.state.connection.lcuData;
  }
}
</script>
