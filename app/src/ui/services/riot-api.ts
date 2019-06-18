import { escape } from 'querystring';
import { request } from '../../lib/riot-api';

export function getSummonerDataByRiotApi(name: string) {
  return request(`summoner/${escape(name)}`).then((data) => {
    return data;
  });
}

export function getSummonerMatchListByRiotApi(accountId: string, start: number, end: number) {
  return request(`summoner/matches/${accountId}/${start}/${end}`).then((data) => {
    return data;
  });
}

export function getAllChampionData() {
  return request(`static/champion/all`).then((data) => {
    return data;
  });
}

export function getAllSpellData() {
  return request(`static/spell/all`).then((data) => {
    return data;
  });
}

export function getAllItemData() {
  return request(`static/item/all`).then((data) => {
    return data;
  });
}

export function getAllPerkData() {
  return request(`static/perk/all`).then((data) => {
    return data;
  });
}
