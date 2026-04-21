import Window from './appWindow'
import path from 'path'

class MainWindow extends Window {
  /**
   * Get window configuration
   *
   * @return Object
   */
  getWindowConfiguration () {
    const isDev = process.env.NODE_ENV === 'development'
    const width = 1120
    const height = 720
    const minWidth = 820
    const minHeight = 520

    const iconsPath = path.resolve(__dirname, '..', '..', '..', '..', 'build', 'icons', 'app')
    const icons = {
      win32: 'anilibria.ico',
      darwin: 'anilibria.icns',
      linux: 'anilibria.png'
    }

    return {
      height,
      width,
      minWidth,
      minHeight,
      show: false,
      frame: false,
      darkTheme: true,
      icon: path.join(iconsPath, icons[process.platform]),
      titleBarStyle: 'hiddenInset',
      useContentSize: true,
      webPreferences: {
        preload: isDev
          ? path.resolve(process.cwd(), 'dist/electron/preload.js')
          : path.resolve(__dirname, 'preload.js'),
        webgl: true,
        webviewTag: true,
        webSecurity: true,
        autoplayPolicy: 'no-user-gesture-required',
        // Temporary compatibility mode for legacy renderer code in development.
        nodeIntegration: isDev,
        contextIsolation: !isDev,
        enableRemoteModule: true,
        experimentalFeatures: false,
        allowRunningInsecureContent: false
      },
      backgroundColor: '#121212'
    }
  }

  get isMain () {
    return true
  }

  /**
   * Get window url
   *
   * @return {string}
   */
  getWindowUrl () {
    return process.env.NODE_ENV === 'development'
      ? 'http://localhost:9080'
      : `file://${__dirname}/index.html`
  }
}

export default new MainWindow()
