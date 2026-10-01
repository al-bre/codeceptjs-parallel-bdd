/// <reference types='codeceptjs' />

export {};

declare global {
  namespace CodeceptJS {
    interface SupportObject {
      I: I;
      title: string;
      current: {type: string};
    }
    interface Methods
      extends
        Playwright,
        REST,
        ApiDataFactory,
        FileSystem {}
    interface I extends Methods, ActorStatic {}
  }
}
