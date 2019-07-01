import { Module, VuexModule, Mutation, MutationAction, Action } from 'vuex-module-decorators'
import axios from 'axios'

const ENDPOINT = 'http://localhost:3000'

@Module({ namespaced: true, name: 'lolstatic' })
export default class Lolstatic extends VuexModule {
  champions: Array<any> = []
  spells: Array<any> = []
  items: Array<any> = []
  perks: Array<any> = []

  @MutationAction({ mutate: ['champions', 'spells', 'items'] })
  async initializeState() {
    return { champions: [], spells: [], items: [] }
  }
  @MutationAction({ mutate: ['champions'] })
  async fetchChampions() {
    const response = await axios.get(`${ENDPOINT}/static/champion/all`)
    return { champions: response.data }
  }
  @MutationAction({ mutate: ['spells'] })
  async fetchSpells() {
    const response = await axios.get(`${ENDPOINT}/static/spell/all`)
    return { spells: response.data }
  }
  @MutationAction({ mutate: ['items'] })
  async fetchItems() {
    const response = await axios.get(`${ENDPOINT}/static/item/all`)
    return { items: response.data }
  }
  @MutationAction({ mutate: ['perks'] })
  async fetchPerks() {
    const response = await axios.get(`${ENDPOINT}/static/perk/all`)
    return { perks: response.data }
  }
}