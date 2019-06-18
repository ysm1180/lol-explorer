import { combineEpics } from 'redux-observable';
import * as lcu from '../features/lcu/epics';
import * as riot from '../features/riot-api/epics';
import * as staticData from '../features/static-data/epics';

export default combineEpics(
  ...Object.values(lcu),
  ...Object.values(riot),
  ...Object.values(staticData)
);
