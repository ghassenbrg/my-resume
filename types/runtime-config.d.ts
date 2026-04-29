export {}

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      cvDataLanguages?: string[]
      emailjsServiceId?: string
      emailjsTemplateId?: string
      emailjsPublicKey?: string
    }
  }
}
