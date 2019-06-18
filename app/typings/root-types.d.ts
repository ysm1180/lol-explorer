import { Epic } from 'redux-observable';
import { ActionType, StateType } from 'typesafe-actions';

declare module 'root-types' {
    export type RootState = StateType<ReturnType<typeof import('../src/ui/store/root-reducer').default>>;
    export type RootAction = ActionType<typeof import('../src/ui/store/root-action').default>;
    export type RootEpic = Epic<RootAction, RootAction, RootState, Services>;
}

declare module 'typesafe-actions' {
    interface Types {
        RootAction: ActionType<typeof import('../src/ui/store/root-action').default>;
    }
}
