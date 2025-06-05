import { ElectronAPI } from '@electron-toolkit/preload'
import { API } from '../main/apis/api'

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
