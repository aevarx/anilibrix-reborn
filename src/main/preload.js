import { contextBridge, ipcRenderer } from 'electron'

const validSendChannels = ['app-action', 'torrent-control', 'player-event']
const validOnChannels = ['app-update', 'torrent-status', 'player-state', 'app:error', 'window:enter-full-screen', 'window:leave-full-screen']

const electronAPI = {
  // Основные каналы общения
  send: (channel, data) => {
    if (validSendChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  on: (channel, func) => {
    if (validOnChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  removeAllListeners: (channel) => {
    if (validOnChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel)
    }
  },
  // Открытие внешних ссылок через main-process
  openExternal: (url) => {
    ipcRenderer.send('app-action', { type: 'open-external', payload: { url } })
  },
  reloadWindow: () => {
    ipcRenderer.send('app-action', { type: 'window-reload' })
  },
  minimizeWindow: () => {
    ipcRenderer.send('app-action', { type: 'window-minimize' })
  },
  toggleMaximizeWindow: () => {
    ipcRenderer.send('app-action', { type: 'window-toggle-maximize' })
  },
  quitApp: () => {
    ipcRenderer.send('app-action', { type: 'app-quit' })
  },
  exitApp: (code = 0) => {
    ipcRenderer.send('app-action', { type: 'app-exit', payload: { code } })
  },
  setAppUserModelId: (id) => {
    ipcRenderer.send('app-action', { type: 'set-app-user-model-id', payload: { id } })
  },
  isWindowFullScreen: () => ipcRenderer.invoke('app-query', { type: 'window-is-full-screen' }),
  // Специфические геттеры
  getPlatform: () => process.platform,
  getVersion: () => '1.0.0-reborn'
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electronAPI', electronAPI)
} else {
  window.electronAPI = electronAPI
}
