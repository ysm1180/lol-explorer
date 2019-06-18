import { applyMiddleware, compose, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { RootAction, RootState, Services } from 'root-types';
import services from '../services';
import rootEpic from './root-epic';
import rootReducer from './root-reducer';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, Services>({
  dependencies: services,
});

const middlewares = [epicMiddleware];
const composeEnhancers =
  (process.env.NODE_ENV === 'development' &&
    window &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const enhancer = composeEnhancers(applyMiddleware(...middlewares));
const store = createStore(rootReducer, enhancer);

epicMiddleware.run(rootEpic);

export default store;
