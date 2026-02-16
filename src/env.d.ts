interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}