import axios from 'axios';
import { Module, MutationAction, VuexModule } from 'vuex-module-decorators';

const ENDPOINT = 'http://localhost:3000';

@Module({ namespaced: true, name: 'match' })
export default class Match extends VuexModule {
  public matches: any[] = [];
  public champions: any = null;

  @MutationAction({ mutate: ['matches'] })
  public async initializeState() {
    return { matches: [] };
  }
  @MutationAction({ mutate: ['matches'] })
  public async updateMatches({ accountId, page }: any) {
    const start = page * 20;
    const response = await axios.get(`${ENDPOINT}/summoner/matches/${accountId}/${start}/20`);
    if (page === 0) {
      return { matches: response.data };
    } else {
      const state: any = this.state;
      return { matches: state.matches.concat(response.data) };
    }
  }
  @MutationAction({ mutate: ['champions'] })
  public async fetchChampions({ seasonId, accountId }: any) {
    const response = await axios.get(`${ENDPOINT}/summoner/champions/${seasonId}/${accountId}`);
    return { champions: response.data };
  }
}
