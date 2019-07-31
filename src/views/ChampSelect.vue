<template>
  <v-layout align-center fill-height justify-center>
    <span class="display-1 font-weight-bold" v-if="!champSelecting">
      챔피언 선택중이 아닙니다.
    </span>
    <v-layout align-center column fill-height justify-center v-else>
      <v-flex v-bind:key="index" v-for="(info, index) in myTeamInfo">
        {{ info }}
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import { END_POINT } from '@/config';
import axios from 'axios';
import { ipcRenderer } from 'electron';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class Home extends Vue {
  private champSelecting: boolean = false;
  private myTeam: any[] = [];
  private myTeamName: any[] = [];
  private myTeamInfo: any[] = [];

  public async created() {
    ipcRenderer.on('lcu-api-message', async (event: any, data: any) => {
      if (data.uri === '/lol-gameflow/v1/gameflow-phase') {
        this.init();
      }
    });
    this.init();
  }

  public async init() {
    await this.checkIfChampSelecting();
    if (this.champSelecting) {
      await this.checkMyTeam();
      await this.checkMyTeamName();
      this.$nextTick(async () => {
        await this.checkMyTeamInfo();
      });
    }
  }

  public async checkIfChampSelecting() {
    const url = `${this.lcuData.protocol}://${this.lcuData.address}:${
      this.lcuData.port
    }/lol-gameflow/v1/gameflow-phase`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${btoa(
          `${this.lcuData.username}:${this.lcuData.password}`
        )}`,
      },
    });

    this.champSelecting = response.data === 'ChampSelect';
  }

  public async checkMyTeam() {
    const response = await axios.get(
      `${this.lcuData.protocol}://${this.lcuData.address}:${
        this.lcuData.port
      }/lol-champ-select/v1/session`,
      {
        headers: {
          Authorization: `Basic ${btoa(
            `${this.lcuData.username}:${this.lcuData.password}`
          )}`,
        },
      }
    );
    this.myTeam = response.data.myTeam;
  }

  public async checkMyTeamName() {
    for (const summoner of this.myTeam) {
      if (summoner.summonerId !== 0) {
        const baseUrl = `${this.lcuData.protocol}://${this.lcuData.address}:${
          this.lcuData.port
        }`;
        const response = await axios.get(
          `${baseUrl}/lol-summoner/v1/summoners/${summoner.summonerId}`,
          {
            headers: {
              Authorization: `Basic ${btoa(
                `${this.lcuData.username}:${this.lcuData.password}`
              )}`,
            },
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
      const response = await axios.get(`${END_POINT}/summoner/${name}`);
      this.myTeamInfo.push(response.data);
    }
  }

  public get lcuData() {
    return this.$store.state.connection.lcuData;
  }
}
</script>
