import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { host } from './host'

const root = ReactDOM.createRoot(document.getElementById('root')!)
const bridge = host()
if (bridge) bridge.command = (command) => {
  if (command === 'dispose') root.unmount()
  else window.dispatchEvent(new CustomEvent('holdover:host-command', { detail: command }))
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
