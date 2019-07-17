import axios from 'axios';
import { Module, MutationAction, VuexModule } from 'vuex-module-decorators';
import {
  IStaticChampion,
  IStaticItem,
  IStaticSpell,
} from '@/store/modules/lolstatic/static-data';

const ENDPOINT = 'http://localhost:3000';

interface IStaticChampions {
  [key: string]: IStaticChampion;
}

interface IStaticItems {
  [key: string]: IStaticItem;
}

interface IStaticSpells {
  [key: string]: IStaticSpell;
}

@Module({ namespaced: true, name: 'lolstatic' })
export default class Lolstatic extends VuexModule {
  public champions: IStaticChampions = {};
  public spells: IStaticSpells = {};
  public items: IStaticItems = {};
  public perks: any[] = [];

  @MutationAction({ mutate: ['champions', 'spells', 'items'] })
  public async initializeState() {
    return { champions: {}, spells: {}, items: {} };
  }

  @MutationAction({ mutate: ['champions'] })
  public async fetchChampions() {
    const response = await axios.get(`${ENDPOINT}/static/champion/all`);
    return { champions: response.data as IStaticChampions };
  }

  @MutationAction({ mutate: ['spells'] })
  public async fetchSpells() {
    const response = await axios.get(`${ENDPOINT}/static/spell/all`);
    return { spells: response.data as IStaticSpells };
  }

  @MutationAction({ mutate: ['items'] })
  public async fetchItems() {
    const response = await axios.get(`${ENDPOINT}/static/item/all`);
    return { items: response.data as IStaticItems };
  }

  @MutationAction({ mutate: ['perks'] })
  public async fetchPerks() {
    const response = await axios.get(`${ENDPOINT}/static/perk/all`);
    return { perks: response.data };
  }
}
