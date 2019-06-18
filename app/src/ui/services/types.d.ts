declare module 'root-types' {
  export type Services = typeof import('./index').default;
}
