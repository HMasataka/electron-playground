import { useState } from 'react'

import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

export interface Config {
  apiUrl: string
}

function App(): React.JSX.Element {
  const [apiUrl, setApiUrl] = useState<string>('')

  const ipcHandle = async () => {
    const response = await window.api.database()
    console.log(response)
  }

  const setConfig = async (url: string) => {
    const response = await window.api.storeConfig({ apiUrl: url })
    console.log(response)
  }

  const getConfig = async () => {
    const response = await window.api.getConfig()
    console.log(response)
  }

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <input
        type="text"
        className="input"
        placeholder="Enter API URL"
        onChange={(e) => setApiUrl(e.target.value)}
      />
      <div className="actions">
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={() => setConfig(apiUrl)}>
            Set Config
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={getConfig}>
            Get Config
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
