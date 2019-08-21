import { END_POINT } from '@/config';
import {
  StaticChampionApiData,
  StaticItemApiData,
  StaticPerkApiData,
  StaticSpellApiData,
} from '@/typings/static-data';
import axios from 'axios';
import { Module, MutationAction, VuexModule } from 'vuex-module-decorators';

export interface StaticChampions {
  [key: string]: StaticChampionApiData;
}

export interface StaticItems {
  [key: string]: StaticItemApiData;
}

export interface StaticSpells {
  [key: string]: StaticSpellApiData;
}

export interface StaticPerks {
  [key: string]: StaticPerkApiData;
}

@Module({ namespaced: true, name: 'lolstatic' })
export default class Lolstatic extends VuexModule {
  public champions: StaticChampions = {};
  public spells: StaticSpells = {};
  public items: StaticItems = {};
  public perks: StaticPerks = {};

  @MutationAction({ mutate: ['champions', 'spells', 'items', 'perks'] })
  public async initializeState() {
    return { champions: {}, spells: {}, items: {}, perks: {} };
  }

  @MutationAction({ mutate: ['champions'] })
  public async fetchChampions() {
    const response = await axios.get(`${END_POINT}/static/champion/all`);
    return { champions: response.data as StaticChampions };
  }

  @MutationAction({ mutate: ['spells'] })
  public async fetchSpells() {
    const response = await axios.get(`${END_POINT}/static/spell/all`);
    return { spells: response.data as StaticSpells };
  }

  @MutationAction({ mutate: ['items'] })
  public async fetchItems() {
    const response = await axios.get(`${END_POINT}/static/item/all`);
    return { items: response.data as StaticItems };
  }

  @MutationAction({ mutate: ['perks'] })
  public async fetchPerks() {
    const response = await axios.get(`${END_POINT}/static/perk/all`);
    return { perks: response.data };
  }
}
