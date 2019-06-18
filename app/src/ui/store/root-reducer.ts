import { combineReducers } from 'redux';
import lcu from '../features/lcu/reducer';
import riotApi from '../features/riot-api/reducer';
import staticData from '../features/static-data/reducer';

const rootReducer = combineReducers({
  lcu,
  riotApi,
  staticData,
});

export default rootReducer;
