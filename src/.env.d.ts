/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
  readonly PUBLIC_IS_DEV: string;
  readonly PUBLIC_SHOW_DEVTOOLS: string;
  readonly PUBLIC_VERSION: string;
  readonly PUBLIC_PROJECT_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}