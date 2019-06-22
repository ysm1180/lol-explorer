import { Module, VuexModule, Mutation, MutationAction, Action } from 'vuex-module-decorators'
import { lcuData, lcuSummonerData } from 'models'
import axios from 'axios'

const ENDPOINT = 'http://localhost:3000'

@Module({ namespaced: true, name: 'connection' })
export default class Connection extends VuexModule {
  status: number = 0
  lcuData: lcuData | undefined = undefined
  lcuSummoner: lcuSummonerData | undefined  = undefined
  summoner = undefined

  @Mutation
  setStatus (status: number) {
    this.status = status
  }
  @Mutation
  setLcuData(lcuData: lcuData) {
    this.lcuData = lcuData
  }
  @Mutation
  setLcuSummoner (data: lcuSummonerData) {
    this.lcuSummoner = data
  }
  @Mutation
  setSummoner (data: any) {
    this.summoner = data
  }

  @MutationAction({ mutate: ['status', 'lcuData', 'lcuSummoner', 'summoner'] })
  async initializeState() {
    return {
      status: 0,
      lcuData: undefined,
      lcuSummoner: undefined,
      summoner: undefined,
    }
  }
  @MutationAction({ mutate: ['summoner'] })
  async updateSummoner(name: string) {
    const response = await axios.get(`${ENDPOINT}/summoner/${name}`)
    return { summoner: response.data }
  }
}