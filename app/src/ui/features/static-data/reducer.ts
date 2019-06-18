import { RiotStaticChampionClientData, RiotStaticItemClientData, RiotStaticPerkClientData, RiotStaticSpellClientData } from 'models';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { loadAllStaticChampionDataAsync, loadAllStaticItemDataAsync, loadAllStaticPerkDataAsync, loadAllStaticSpellDataAsync } from './actions';

const emptyChampionData: RiotStaticChampionClientData[] = [];
const emptySpellData: RiotStaticSpellClientData[] = [];
const emptyItemData: RiotStaticItemClientData[] = [];
const emptyPerkData: RiotStaticPerkClientData[] = [];

const reducer = combineReducers({
  isLoadingAllChampion: createReducer(false)
    .handleAction(loadAllStaticChampionDataAsync.request, (state, action) => true)
    .handleAction(
      [loadAllStaticChampionDataAsync.success, loadAllStaticChampionDataAsync.failure],
      (state, action) => false
    ),
  champions: createReducer({
    success: false,
    error: false,
    data: emptyChampionData,
  })
    .handleAction(loadAllStaticChampionDataAsync.success, (state, action) => ({
      success: true,
      error: false,
      data: action.payload,
    }))
    .handleAction(loadAllStaticChampionDataAsync.failure, (state, action) => ({
      success: false,
      error: true,
      data: [],
      errorData: action.payload,
    })),
  isLoadingAllSpell: createReducer(false)
    .handleAction(loadAllStaticSpellDataAsync.request, (state, action) => true)
    .handleAction(
      [loadAllStaticSpellDataAsync.success, loadAllStaticSpellDataAsync.failure],
      (state, action) => false
    ),
  spells: createReducer({
    success: false,
    error: false,
    data: emptySpellData,
  })
    .handleAction(loadAllStaticSpellDataAsync.success, (state, action) => ({
      success: true,
      error: false,
      data: action.payload,
    }))
    .handleAction(loadAllStaticSpellDataAsync.failure, (state, action) => ({
      success: false,
      error: true,
      data: [],
      errorData: action.payload,
    })),
  isLoadingAllItem: createReducer(false)
    .handleAction(loadAllStaticItemDataAsync.request, (state, action) => true)
    .handleAction(
      [loadAllStaticItemDataAsync.success, loadAllStaticItemDataAsync.failure],
      (state, action) => false
    ),
  items: createReducer({
    success: false,
    error: false,
    data: emptyItemData,
  })
    .handleAction(loadAllStaticItemDataAsync.success, (state, action) => ({
      success: true,
      error: false,
      data: action.payload,
    }))
    .handleAction(loadAllStaticItemDataAsync.failure, (state, action) => ({
      success: false,
      error: true,
      data: [],
      errorData: action.payload,
    })),

  isLoadingAllPerk: createReducer(false)
    .handleAction(loadAllStaticPerkDataAsync.request, (state, action) => true)
    .handleAction(
      [loadAllStaticPerkDataAsync.success, loadAllStaticPerkDataAsync.failure],
      (state, action) => false
    ),
  perks: createReducer({
    success: false,
    error: false,
    data: emptyPerkData,
  })
    .handleAction(loadAllStaticPerkDataAsync.success, (state, action) => ({
      success: true,
      error: false,
      data: action.payload,
    }))
    .handleAction(loadAllStaticPerkDataAsync.failure, (state, action) => ({
      success: false,
      error: true,
      data: [],
      errorData: action.payload,
    })),
});

export default reducer;
