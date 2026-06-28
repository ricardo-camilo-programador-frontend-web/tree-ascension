/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADSTERRA_PUBLISHER_ID?: string
  readonly VITE_ENABLE_ADSTERRA?: string
  readonly DEV?: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
