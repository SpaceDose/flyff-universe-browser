/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEST_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
