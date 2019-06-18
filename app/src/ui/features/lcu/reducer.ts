import { createReducer } from 'typesafe-actions';
import {
  loadLcuCurrentSummonerAsync,
  connectLcu,
  initLcuData,
  loadLcuCurrentSummoner,
} from './actions';
import { combineReducers } from 'redux';
import { LcuSummonerData } from 'models';

const emptyLcuConnection = {
  protocol: 'http',
  address: '',
  port: 0,
  username: '',
  password: '',
};

const emptyLcuSummonerData: LcuSummonerData = {
  accountId: 0,
  displayName: '',
  internalName: '',
  percentCompleteForNextLevel: 0,
  profileIconId: 0,
  puuid: '',
  rerollPoints: {
    currentPoints: 0,
    maxRolls: 0,
    numberOfRolls: 0,
    pointsCostToRoll: 0,
    pointsToReroll: 0,
  },
  summonerId: 0,
  summonerLevel: 0,
  xpSinceLastLevel: 0,
  xpUntilNextLevel: 0,
};

const reducer = combineReducers({
  connection: createReducer(emptyLcuConnection)
    .handleAction(connectLcu, (state, action) => action.payload)
    .handleAction(initLcuData, (state, action) => emptyLcuConnection),
  isLoadingLcuSummoner: createReducer(false)
    .handleAction(loadLcuCurrentSummonerAsync.request, (state, action) => true)
    .handleAction(
      [
        initLcuData,
        loadLcuCurrentSummonerAsync.success,
        loadLcuCurrentSummonerAsync.failure,
        loadLcuCurrentSummoner,
      ],
      (state, action) => false
    ),
  currentSummoner: createReducer({
    success: false,
    error: false,
    summoner: emptyLcuSummonerData,
  })
    .handleAction(loadLcuCurrentSummonerAsync.success, (state, action) => {
      return { success: true, error: false, summoner: action.payload };
    })
    .handleAction(loadLcuCurrentSummonerAsync.failure, (state, action) => ({
      success: false,
      error: true,
      summoner: emptyLcuSummonerData,
      errorData: action.payload,
    }))
    .handleAction(initLcuData, (state, action) => ({
      success: false,
      error: false,
      summoner: emptyLcuSummonerData,
    }))
    .handleAction(loadLcuCurrentSummoner, (state, action) => ({
      success: true,
      error: false,
      summoner: action.payload,
    })),
});

export default reducer;
