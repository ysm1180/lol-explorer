<template>
  <v-app>
    <!-- topbar -->
    <div class="toolbar" id="top-bar">
      <div class="buttons">
        <button @click="$router.go(-1)" class="icon-button">
          <v-icon dark small>arrow_back_ios</v-icon>
        </button>
        <button @click="$router.go(1)" class="icon-button">
          <v-icon dark small>arrow_forward_ios</v-icon>
        </button>
      </div>
      <div class="buttons large">
        <button
          :class="isSummonerPage() && 'selected'"
          @click="enterHome()"
          class="icon-button"
          title="소환사 정보"
        >
          <span v-if="!lcuSummoner || !summoner">
            소환사 정보
          </span>
          <span v-else>
            <span class="d-flex align-center justify-center flex-row">
              <v-img :src="summoner.iconUrl" class="summoner-icon mr-2">
                <span
                  class="summoner-level font-weight-bold text-center white--text"
                >
                  {{ summoner.summonerLevel }}
                </span>
              </v-img>
              {{ lcuSummoner.displayName }}
            </span>
          </span>
        </button>
        <button
          :class="isRunePage() && 'selected'"
          @click="enterRunePage()"
          class="icon-button"
        >
          룬 관리
        </button>
        <button
          :class="isGamePickBanPage() && 'selected'"
          @click="enterChampionSelectPage()"
          class="icon-button"
        >
          게임 설정
        </button>
      </div>
      <div class="ml-3">
        <input
          class="search-text"
          placeholder="소환사, 챔피언 검색"
          type="text"
        />
      </div>
      <div class="buttons large">
        <button
          :class="isDevPage() && 'selected'"
          @click="enterDevPage()"
          class="icon-button"
        >
          개발자
        </button>
      </div>
    </div>
    <router-view style="padding-top:59px;" />
  </v-app>
</template>
<script lang="ts">
import { ipcRenderer } from 'electron';
import { LcuConnectionData } from 'models';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class App extends Vue {
  public get lcuSummoner() {
    return this.$store.state.connection.lcuSummoner;
  }

  public get summoner() {
    return this.$store.state.connection.summoner;
  }

  public get status() {
    return this.$store.state.connection.status;
  }

  public created() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'F5') {
        location.href = '/match';
      }
    });

    ipcRenderer.on(
      'lcu-connect',
      async (event: any, lcuData: LcuConnectionData) => {
        this.$store.commit('connection/setLcuData', lcuData);
        this.$store.commit('connection/setStatus', 'WAITING_LOGIN');
        await this.$store.dispatch('connection/loadLcuSummoner', lcuData);
        if (this.status === 'LOGIN_COMPLETE') {
          await this.$store.dispatch(
            'connection/updateSummoner',
            this.lcuSummoner.displayName
          );
          this.$router.push(`/match/${this.summoner.accountId}`);
        }
      }
    );

    ipcRenderer.on('lcu-disconnect', () => {
      this.$store.dispatch('connection/initializeState');
    });

    ipcRenderer.on('lcu-api-message', async (event: any, data: any) => {
      console.log(data);
      if (
        this.status !== 'LOGIN_COMPLETE' &&
        data.uri === '/lol-summoner/v1/current-summoner' &&
        data.data.displayName
      ) {
        await this.$store.commit('connection/setStatus', 'LOGIN_COMPLETE');
        await this.$store.commit('connection/setLcuSummoner', data.data);
        await this.$store.dispatch(
          'connection/updateSummoner',
          this.lcuSummoner.displayName
        );
        this.$router.push(`/match/${this.summoner.accountId}`);
      } else if (
        this.status === 'LOGIN_COMPLETE' &&
        data.uri === '/lol-gameflow/v1/gameflow-phase' &&
        data.data === 'ChampSelect'
      ) {
        this.enterChampionSelectPage();
        ipcRenderer.send('show-focus');
      }
    });

    // fetch statics
    this.$store.dispatch('lolstatic/fetchChampions');
    this.$store.dispatch('lolstatic/fetchSpells');
    this.$store.dispatch('lolstatic/fetchItems');
    this.$store.dispatch('lolstatic/fetchPerks');
  }

  public isSummonerPage() {
    if (this.status === 'LOGIN_COMPLETE' && this.summoner) {
      const homeUrl = `/match/${this.summoner.accountId}`;
      return this.$router.currentRoute.path === homeUrl;
    } else {
      return this.routerStartWith('/match');
    }
  }

  public isRunePage() {
    return this.routerStartWith('/rune');
  }

  public isGamePickBanPage() {
    return this.routerStartWith('/gamepickban');
  }

  public isDevPage() {
    return this.routerStartWith('/dev');
  }

  public enterHome() {
    let homeUrl;
    if (this.status === 'LOGIN_COMPLETE') {
      homeUrl = `/match/${this.summoner.accountId}`;
      if (this.$router.currentRoute.path !== homeUrl) {
        this.$router.push(homeUrl);
      }
    } else {
      homeUrl = `/match`;
    }

    if (this.$router.currentRoute.path !== homeUrl) {
      this.$router.push(homeUrl);
    }
  }

  public enterRunePage() {
    const url = `/rune`;
    if (this.$router.currentRoute.path !== url) {
      this.$router.push(url);
    }
  }

  public enterChampionSelectPage() {
    const url = `/gamepickban`;
    if (this.$router.currentRoute.path !== url) {
      this.$router.push(url);
    }
  }

  public enterDevPage() {
    const url = `/dev`;
    if (this.$router.currentRoute.path !== url) {
      this.$router.push(url);
    }
  }

  public routerStartWith(...urls: string[]) {
    for (const url of urls) {
      if (this.$router.currentRoute.path.indexOf(url) === 0) {
        return true;
      }
    }

    return false;
  }
}
</script>

<style lang="scss">
#app {
  width: 100vw;
  min-width: 1024px;
  height: 100vh;
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  .toolbar {
    display: flex;

    position: absolute;
    left: 0;
    top: 0;
    width: 100%;

    padding: 10px;
    margin-top: 0;
    text-align: left;

    background-color: #2a2e38;
    color: white;

    z-index: 2;
  }
}

.buttons {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}

.buttons.large > .icon-button {
  margin: 0 2px;
}

.icon-button {
  padding: 2px 5px;
  outline: 0;
  font-size: 12px;

  &.selected {
    box-shadow: 0 4px 2px -2px darkorange;
  }
}

.cursor__none {
  user-select: none;
}

.cursor__normal {
  cursor: default !important;
}

.cursor__pointer {
  cursor: pointer;
}

.html-content {
  a {
    text-decoration: none;
    color: #00bfa5;
  }

  hr {
    margin: 5px 0;
  }
}

.margin__none {
  margin: 0 !important;
}

.font-size__small {
  font-size: 11px;
}

.vertical__top {
  vertical-align: top !important;
}

.float__right {
  float: right;
}

.search-text {
  position: relative;
  padding: 10px;
  background-color: #dddddd;
  width: 550px;
  color: black;
  border-radius: 2px;
  outline: 0;
  font-size: 13px;
}
</style>

<style lang="scss" scoped>
.summoner-icon {
  display: inline-block;
  min-width: 36px;
  min-height: 36px;
  max-width: 36px;
  max-height: 36px;
  border-radius: 50%;
}

.summoner-level {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  font-size: 10px;
  padding: 0 2px;

  background-color: rgba(#212121, 0.7);
  border-radius: 10px;
}
</style>
