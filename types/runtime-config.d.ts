export {}

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      emailjsServiceId?: string
      emailjsTemplateId?: string
      emailjsPublicKey?: string
    }
  }
}
