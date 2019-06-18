import { RiotMatchData, RiotSummonerData } from 'models';
import { createAsyncAction } from 'typesafe-actions';
import { IApiError } from '../../../lib/riot-api';

export const loadRiotSummonerDataAsync = createAsyncAction(
  'LOAD_RIOT_SUMMONER_DATA_REQUEST',
  'LOAD_RIOT_SUMMONER_DATA_SUCCESS',
  'LOAD_RIOT_SUMMONER_DATA_FAILURE'
)<string, RiotSummonerData, IApiError>();

export const loadRiotSummonerMatchListAsync = createAsyncAction(
  'LOAD_RIOT_SUMMONER_MATCH_LIST_REQUEST',
  'LOAD_RIOT_SUMMONER_MATCH_LIST_SUCCESS',
  'LOAD_RIOT_SUMMONER_MATCH_LIST_FAILURE'
)<{ accountId: string; start: number; end: number }, RiotMatchData[], IApiError>();
