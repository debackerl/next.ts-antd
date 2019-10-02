declare module 'i18next-sync-fs-backend' {
  import * as i18next from "i18next";

  interface BackendOptions {
    loadPath: string;
    addPath: string;
    jsonIndent: Number;
  }

  type WriteCallback = () => void;

  export default class I18NextSyncFsBackend implements i18next.BackendModule<BackendOptions> {
    constructor(services?: any, options?: BackendOptions);

    init(services?: any, options?: BackendOptions): void;
    read(language: string, namespace: string, callback: i18next.ReadCallback): void;
    create(languages: string | string[], namespace: string, key: string, fallbackValue: string, callback?: WriteCallback): void;
    write(): void;
    writeFile(lng: string, namespace: string): void;
    queue(lng: string, namespace: string, key: string, fallbackValue: string, callback?: WriteCallback): void;

    type: "backend";
    services: any;
    options: BackendOptions;
  }
}
