import { ipcMain, ipcRenderer } from 'electron'
import { getHello, getZipCode } from './store'

// mainプロセスにハンドリングする。mainプロセス上で呼び出す。
export const setAPI = () => {
  ipcMain.handle('getHello', (_, name: string) => getHello(name))
  ipcMain.handle('getZipCode', getZipCode)
}

// rendererプロセスに公開するAPI。preload上で呼び出す。
export const APIInvoker = {
  getHello: (name: string) => ipcRenderer.invoke('getHello', name),
  getZipCode: () => ipcRenderer.invoke('getZipCode')
}

// rendererプロセスに公開するAPIの型定義。preload上で呼び出す。
export type API = typeof APIInvoker
