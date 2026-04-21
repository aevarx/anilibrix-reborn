export default {
  install: function (Vue) {
    Vue.prototype.$electron = {
      ipcRenderer: {
        send: (channel, data) => window.electronAPI.send(channel, data),
        on: (channel, listener) => window.electronAPI.on(channel, listener),
      }
    }
  }
}
