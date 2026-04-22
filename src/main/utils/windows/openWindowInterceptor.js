import { shell } from 'electron'

function openWindowInterceptor (details) {
  if (!details.url.startsWith('resource://')) {
    shell.openExternal(details.url)
    return { action: 'deny' }
  }

  return {
    action: 'allow',
    overrideBrowserWindowOptions: {
      autoHideMenuBar: true
    }
  }
}

export { openWindowInterceptor }
