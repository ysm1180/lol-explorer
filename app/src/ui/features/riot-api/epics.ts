import { RootEpic } from 'root-types';
import { from, of } from 'rxjs';
import { catchError, filter, flatMap, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { loadRiotSummonerDataAsync, loadRiotSummonerMatchListAsync } from './actions';

export const LoadRiotSummonerDataEpic: RootEpic = (action$, state$, { riotApi }) =>
  action$.pipe(
    filter(isActionOf(loadRiotSummonerDataAsync.request)),
    switchMap((action) =>
      from(riotApi.getSummonerDataByRiotApi(action.payload)).pipe(
        flatMap((data) => [
          loadRiotSummonerDataAsync.success(data),
          loadRiotSummonerMatchListAsync.request({ accountId: data.accountId, start: 0, end: 20 }),
        ]),
        catchError((err) => of(loadRiotSummonerDataAsync.failure(err)))
      )
    )
  );

export const LoadRiotSummonerMatchListEpic: RootEpic = (action$, state$, { riotApi }) =>
  action$.pipe(
    filter(isActionOf(loadRiotSummonerMatchListAsync.request)),
    switchMap((action) =>
      from(
        riotApi.getSummonerMatchListByRiotApi(
          action.payload.accountId,
          action.payload.start,
          action.payload.end
        )
      ).pipe(
        map(loadRiotSummonerMatchListAsync.success),
        catchError((err) => of(loadRiotSummonerMatchListAsync.failure(err)))
      )
    )
  );
