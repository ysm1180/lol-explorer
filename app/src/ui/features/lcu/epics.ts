import { from, of } from 'rxjs';
import { filter, switchMap, catchError, flatMap } from 'rxjs/operators';
import { RootEpic } from 'root-types';
import { isActionOf } from 'typesafe-actions';
import { loadRiotSummonerDataAsync } from '../riot-api/actions';
import { loadLcuCurrentSummonerAsync, loadLcuCurrentSummoner } from './actions';

export const LoadLcuCurrentSummonerAsyncDataEpic: RootEpic = (action$, state$, { lcu }) =>
  action$.pipe(
    filter(isActionOf(loadLcuCurrentSummonerAsync.request)),
    switchMap((action) =>
      from(lcu.loadCurrentSummoner(action.payload)).pipe(
        flatMap((data) => [
          loadLcuCurrentSummonerAsync.success(data),
          loadRiotSummonerDataAsync.request(data.displayName),
        ]),
        catchError((err) => of(loadLcuCurrentSummonerAsync.failure(err)))
      )
    )
  );

export const LoadLcuCurrentSummonerDataEpic: RootEpic = (action$, state$, { lcu }) =>
  action$.pipe(
    filter(isActionOf(loadLcuCurrentSummoner)),
    flatMap((action) => [loadRiotSummonerDataAsync.request(action.payload.displayName)])
  );
