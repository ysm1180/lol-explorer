import { END_POINT } from '@/config';
import axios from 'axios';
import { LcuConnectionData, LcuSummonerData } from 'models';
import {
  Module,
  Mutation,
  MutationAction,
  VuexModule,
} from 'vuex-module-decorators';

@Module({ namespaced: true, name: 'connection' })
export default class Connection extends VuexModule {
  public status: string = 'WAITING_CLIENT';
  public lcuData: LcuConnectionData | undefined = undefined;
  public lcuSummoner: LcuSummonerData | undefined = undefined;
  public summoner = undefined;

  @Mutation
  public setStatus(status: string) {
    this.status = status;
  }

  @Mutation
  public setLcuData(lcuData: LcuConnectionData) {
    this.lcuData = lcuData;
  }

  @Mutation
  public setLcuSummoner(data: LcuSummonerData) {
    this.lcuSummoner = data;
  }

  @Mutation
  public setSummoner(data: any) {
    this.summoner = data;
  }

  @MutationAction({ mutate: ['status', 'lcuData', 'lcuSummoner', 'summoner'] })
  public async initializeState() {
    return {
      status: 'WAITING_CLIENT',
      lcuData: undefined,
      lcuSummoner: undefined,
      summoner: undefined,
    };
  }

  @MutationAction({ mutate: ['status', 'lcuSummoner'] })
  public async loadLcuSummoner(lcuData: LcuConnectionData) {
    const response = await axios.get(
      `${lcuData.protocol}://${lcuData.address}:${
        lcuData.port
      }/lol-summoner/v1/current-summoner`,
      {
        headers: {
          Authorization: `Basic ${btoa(
            `${lcuData.username}:${lcuData.password}`
          )}`,
        },
      }
    );
    return {
      status: 'LOGIN_COMPLETE',
      lcuSummoner: response.data,
    };
  }

  @MutationAction({ mutate: ['summoner'] })
  public async updateSummoner(name: string) {
    const response = await axios.get(`${END_POINT}/summoner/${name}`);
    return { summoner: response.data };
  }
}
