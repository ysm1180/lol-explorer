import { Module, VuexModule, Mutation, MutationAction, Action } from 'vuex-module-decorators'
import axios from 'axios'

const ENDPOINT = 'http://localhost:3000'

@Module({ namespaced: true, name: 'match' })
export default class Match extends VuexModule {
  matches: Array<any> = []
  champions: any = null

  @Mutation
  initialize () {
    this.matches = []
    this.champions = null
  }

  @MutationAction({ mutate: ['matches'] })
  async initializeState() {
    return { matches: [] }
  }
  @MutationAction({ mutate: ['matches'] })
  async updateMatches({ accountId, page }: any) {
    const start = page * 20
    const response = await axios.get(`${ENDPOINT}/summoner/matches/${accountId}/${start}/20`)
    if (page === 0) {
      return { matches: response.data }
    } else {
      const state: any = this.state
      return { matches: state.matches.concat(response.data) }
    }
  }
  @MutationAction({ mutate: ['champions'] })
  async fetchChampions({ seasonId, accountId }: any) {
    const response = await axios.get(`${ENDPOINT}/summoner/champions/${seasonId}/${accountId}`)
    return { champions: response.data }
  }
}