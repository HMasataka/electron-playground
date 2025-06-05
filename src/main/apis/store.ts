import Store from 'electron-store'

export function getHello(name: string): string {
  return `Hello, ${name}!`
}

export interface Config {
  apiUrl: string
}

const store = new Store<Config>()

export function getConfig(): Config {
  const config = store.get('config', { apiUrl: '' })
  return config
}

export function storeConfig(config: Config) {
  console.log('storeConfig', config)
  store.set('config', config)
}
