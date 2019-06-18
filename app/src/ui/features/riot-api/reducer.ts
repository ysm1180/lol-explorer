import { RiotMatchData, RiotSummonerData } from 'models';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { loadRiotSummonerDataAsync, loadRiotSummonerMatchListAsync } from './actions';

const emptyRiotSummonerData: RiotSummonerData = {
  id: '',
  accountId: '',
  name: '',
  summonerLevel: 0,
  iconUrl: '',
  profileIconId: 0,
  puuid: '',
  seasons: [],
};

const emptyRiotMatchList: RiotMatchData[] = [];

const reducer = combineReducers({
  isLoadingRiotSummoner: createReducer(false)
    .handleAction(loadRiotSummonerDataAsync.request, (state, action) => true)
    .handleAction(
      [loadRiotSummonerDataAsync.success, loadRiotSummonerDataAsync.failure],
      (state, action) => false
    ),
  riotSummoner: createReducer({
    success: false,
    error: false,
    summoner: emptyRiotSummonerData,
  })
    .handleAction(loadRiotSummonerDataAsync.success, (state, action) => ({
      success: true,
      error: false,
      summoner: action.payload,
    }))
    .handleAction(loadRiotSummonerDataAsync.failure, (state, action) => ({
      success: false,
      error: true,
      summoner: emptyRiotSummonerData,
      errorData: action.payload,
    })),
  isLoadingRiotSummonerMatchList: createReducer(false)
    .handleAction(loadRiotSummonerMatchListAsync.request, (state, action) => true)
    .handleAction(
      [loadRiotSummonerMatchListAsync.success, loadRiotSummonerMatchListAsync.failure],
      (state, action) => false
    ),
  riotMatchList: createReducer({
    success: false,
    error: false,
    matches: emptyRiotMatchList,
  })
    .handleAction(loadRiotSummonerMatchListAsync.success, (state, action) => ({
      success: true,
      error: false,
      matches: [...state.matches, ...action.payload],
    }))
    .handleAction(loadRiotSummonerDataAsync.failure, (state, action) => ({
      success: false,
      error: true,
      matches: [...state.matches],
      errorData: action.payload,
    })),
});

export default reducer;
