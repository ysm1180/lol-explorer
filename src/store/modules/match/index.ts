import { Module, VuexModule, Mutation, MutationAction, Action } from 'vuex-module-decorators'
import axios from 'axios'

const ENDPOINT = 'http://localhost:3000'

@Module({ namespaced: true, name: 'match' })
export default class Match extends VuexModule {
  matches: Array<any> = []

  @Mutation
  setMatches (matches: Array<any>) {
    this.matches = matches
  }

  @MutationAction({ mutate: ['matches'] })
  async initializeState() {
    return { matches: [] }
  }
  @MutationAction({ mutate: ['matches'] })
  async updateMatches({ accountId, page }: any) {
    const start = page * 10 + 1
    const response = await axios.get(`${ENDPOINT}/summoner/matches/${accountId}/${start}/10`)
    if (page === 0) {
      return { matches: response.data }
    } else {
      const state: any = this.state
      return { matches: state.matches.concat(response.data) }
    }
  }
}