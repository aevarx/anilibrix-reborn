/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
// require('electron-debug')({ showDevTools: true });

// Install `vue-devtools`
require('electron').app.on('ready', () => {
  if (process.env.ENABLE_VUE_DEVTOOLS !== '1') {
    console.log('Vue Devtools extension is disabled. Set ENABLE_VUE_DEVTOOLS=1 to enable.')
    return
  }

  const {
    default: installExtension,
    VUEJS_DEVTOOLS
  } = require('electron-devtools-installer')

  installExtension(VUEJS_DEVTOOLS, { loadExtensionOptions: { allowFileAccess: true } })
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err))
})

// Require `main` process to boot app
require('./index')
