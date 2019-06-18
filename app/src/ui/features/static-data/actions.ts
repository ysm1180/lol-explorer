import { RiotStaticChampionClientData, RiotStaticItemClientData, RiotStaticPerkClientData, RiotStaticSpellClientData } from 'models';
import { createAsyncAction } from 'typesafe-actions';
import { IApiError } from '../../../lib/riot-api';

export const loadAllStaticChampionDataAsync = createAsyncAction(
  'LOAD_ALL_STATIC_CHAMPION_DATA_REQUEST',
  'LOAD_ALL_STATIC_CHAMPION_DATA_SUCCESS',
  'LOAD_ALL_STATIC_CHAMPION_DATA_FAILURE'
)<undefined, RiotStaticChampionClientData[], IApiError>();

export const loadAllStaticSpellDataAsync = createAsyncAction(
  'LOAD_ALL_STATIC_SPELL_DATA_REQUEST',
  'LOAD_ALL_STATIC_SPELL_DATA_SUCCESS',
  'LOAD_ALL_STATIC_SPELL_DATA_FAILURE'
)<undefined, RiotStaticSpellClientData[], IApiError>();

export const loadAllStaticItemDataAsync = createAsyncAction(
  'LOAD_ALL_STATIC_ITEM_DATA_REQUEST',
  'LOAD_ALL_STATIC_ITEM_DATA_SUCCESS',
  'LOAD_ALL_STATIC_ITEM_DATA_FAILURE'
)<undefined, RiotStaticItemClientData[], IApiError>();

export const loadAllStaticPerkDataAsync = createAsyncAction(
  'LOAD_ALL_STATIC_PERK_DATA_REQUEST',
  'LOAD_ALL_STATIC_PERK_DATA_SUCCESS',
  'LOAD_ALL_STATIC_PERK_DATA_FAILURE'
)<undefined, RiotStaticPerkClientData[], IApiError>();
