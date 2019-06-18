import { RootEpic } from 'root-types';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { loadAllStaticChampionDataAsync, loadAllStaticSpellDataAsync, loadAllStaticItemDataAsync, loadAllStaticPerkDataAsync } from './actions';

export const LoadAllStaticChampionDataEpic: RootEpic = (action$, state$, { riotApi }) =>
  action$.pipe(
    filter(isActionOf(loadAllStaticChampionDataAsync.request)),
    switchMap(() =>
      from(riotApi.getAllChampionData()).pipe(
        map(loadAllStaticChampionDataAsync.success),
        catchError((err) => of(loadAllStaticChampionDataAsync.failure(err)))
      )
    )
  );

export const LoadAllStaticSpellDataEpic: RootEpic = (action$, state$, { riotApi }) =>
  action$.pipe(
    filter(isActionOf(loadAllStaticSpellDataAsync.request)),
    switchMap(() =>
      from(riotApi.getAllSpellData()).pipe(
        map(loadAllStaticSpellDataAsync.success),
        catchError((err) => of(loadAllStaticSpellDataAsync.failure(err)))
      )
    )
  );

export const LoadAllStaticItemDataEpic: RootEpic = (action$, state$, { riotApi }) =>
  action$.pipe(
    filter(isActionOf(loadAllStaticItemDataAsync.request)),
    switchMap(() =>
      from(riotApi.getAllItemData()).pipe(
        map(loadAllStaticItemDataAsync.success),
        catchError((err) => of(loadAllStaticItemDataAsync.failure(err)))
      )
    )
  );

  export const LoadAllStaticPerkDataEpic: RootEpic = (action$, state$, { riotApi }) =>
  action$.pipe(
    filter(isActionOf(loadAllStaticPerkDataAsync.request)),
    switchMap(() =>
      from(riotApi.getAllPerkData()).pipe(
        map(loadAllStaticPerkDataAsync.success),
        catchError((err) => of(loadAllStaticPerkDataAsync.failure(err)))
      )
    )
  );

