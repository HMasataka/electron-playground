import { ipcMain, ipcRenderer } from 'electron'
import { getHello, getConfig, storeConfig } from './store'
import { Config } from './store'
import { Do } from '../db/db'

// mainプロセスにハンドリングする。mainプロセス上で呼び出す。
export const setAPI = () => {
  ipcMain.handle('getHello', (_, name: string) => getHello(name))
  ipcMain.handle('storeConfig', (_, config: Config) => storeConfig(config))
  ipcMain.handle('getConfig', getConfig)
  ipcMain.handle('database', Do)
}

// rendererプロセスに公開するAPI。preload上で呼び出す。
export const APIInvoker = {
  getHello: (name: string) => ipcRenderer.invoke('getHello', name),
  getConfig: () => ipcRenderer.invoke('getConfig'),
  storeConfig: (config: Config) => ipcRenderer.invoke('storeConfig', config),
  database: () => ipcRenderer.invoke('database')
}

// rendererプロセスに公開するAPIの型定義。preload上で呼び出す。
export type API = typeof APIInvoker
