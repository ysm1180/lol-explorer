import { ILCUData, LcuSummonerData } from 'models';
import { createAction, createAsyncAction } from 'typesafe-actions';
import { CONNECT, INIT, LOAD_CURRENT_SUMMONER } from './constants';
import { IApiError } from '../../../lib/riot-api';

export const connectLcu = createAction(CONNECT, (action) => {
  return (data: ILCUData) => action({ ...data });
});

export const initLcuData = createAction(INIT, (action) => {
  return () => action();
});

export const loadLcuCurrentSummonerAsync = createAsyncAction(
  'LOAD_CURRENT_SUMMONER_REQUEST',
  'LOAD_CURRENT_SUMMONER_SUCCESS',
  'LOAD_CURRENT_SUMMONER_FAILURE'
)<ILCUData, LcuSummonerData, IApiError>();

export const loadLcuCurrentSummoner = createAction(LOAD_CURRENT_SUMMONER, (action) => {
  return (data: LcuSummonerData) => action({ ...data });
});
