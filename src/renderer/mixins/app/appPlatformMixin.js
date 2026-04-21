export default {
  data () {
    return {
      is_fullscreen: false
    }
  },

  computed: {

    /**
     * Check if current windows is on fullscreen
     *
     * @return {boolean}
     */
    isOnFullscreen () {
      return !!this.is_fullscreen
    },

    /**
     * Check if mac os
     *
     * @return {boolean}
     */
    isMac () {
      return process.platform === 'darwin'
    },

    /**
     * Check if windows os
     *
     * @return {boolean}
     */
    isWindows () {
      return process.platform === 'win32'
    },

    /**
     * Check if linux os
     *
     * @return {boolean}
     */    
    isLinux(){
      return process.platform === 'linux'
    },

    /**
     * Is mac and on fullscreen
     *
     * @return {boolean}
     */
    isMacOnFullscreen () {
      return !!(this.isMac && this.isOnFullscreen)
    }
  },

  methods: {

    /**
     * Set fullscreen state
     *
     * @return void
     */
    setFullscreenState () {
      window.electronAPI
        .isWindowFullScreen()
        .then(state => { this.is_fullscreen = !!state })
        .catch(() => { this.is_fullscreen = false })
    }

  },

  created () {
    // Check if window is fullscreen
    this.setFullscreenState()

    // Set fullscreen events
    window.electronAPI.on('window:enter-full-screen', this.setFullscreenState)
    window.electronAPI.on('window:leave-full-screen', this.setFullscreenState)
  },

  beforeDestroy () {
    // Remove fullscreen events
    window.electronAPI.removeAllListeners('window:enter-full-screen')
    window.electronAPI.removeAllListeners('window:leave-full-screen')
  }
}
