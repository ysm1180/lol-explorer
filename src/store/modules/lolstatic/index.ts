import axios from 'axios';
import { Module, MutationAction, VuexModule } from 'vuex-module-decorators';

const ENDPOINT = 'http://localhost:3000';

@Module({ namespaced: true, name: 'lolstatic' })
export default class Lolstatic extends VuexModule {
  public champions: any[] = [];
  public spells: any[] = [];
  public items: any[] = [];
  public perks: any[] = [];

  @MutationAction({ mutate: ['champions', 'spells', 'items'] })
  public async initializeState() {
    return { champions: [], spells: [], items: [] };
  }
  @MutationAction({ mutate: ['champions'] })
  public async fetchChampions() {
    const response = await axios.get(`${ENDPOINT}/static/champion/all`);
    return { champions: response.data };
  }
  @MutationAction({ mutate: ['spells'] })
  public async fetchSpells() {
    const response = await axios.get(`${ENDPOINT}/static/spell/all`);
    return { spells: response.data };
  }
  @MutationAction({ mutate: ['items'] })
  public async fetchItems() {
    const response = await axios.get(`${ENDPOINT}/static/item/all`);
    return { items: response.data };
  }
  @MutationAction({ mutate: ['perks'] })
  public async fetchPerks() {
    const response = await axios.get(`${ENDPOINT}/static/perk/all`);
    return { perks: response.data };
  }
}
