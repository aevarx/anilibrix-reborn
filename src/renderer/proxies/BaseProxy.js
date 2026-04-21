import __get from 'lodash/get'
import store from '@store/index'
import axios from '@plugins/axios'
import FormData from 'form-data'
import { meta, version } from '@package'

export default class BaseProxy {
  normalizeApiEndpoint (endpoint) {
    if (!endpoint || endpoint.includes('anilibriaqt.anilib.top')) {
      return process.env.API_ENDPOINT_URL
    }
    return endpoint
  }

  normalizeStaticEndpoint (endpoint) {
    if (!endpoint || endpoint.includes('anilibriaqt.anilib.top')) {
      return process.env.STATIC_ENDPOINT_URL
    }
    return endpoint
  }

  /**
   * The method used to perform an AJAX-request.
   *
   * @param method
   * @param {string}  url The URL for the request.
   * @param parameters
   *
   * @returns {Promise} The result in a promise.
   */
  async submit (method, url, parameters = {}) {
    // Set headers
    // Add user-agent
    const headers = { ...parameters.headers, ...this.getRequestHeaders() }

    // Make request
    // eslint-disable-next-line no-return-await
    return await axios.request({
      url,
      method,
      ...parameters,
      headers,
      timeout: 15000
    })
  }

  /**
   * Parse base response model
   *
   * @param response
   * @return {*}
   */
  handleResponse (response) {
    const data = __get(response, 'data', null)
    const status = __get(response, 'status', false)
    const message = __get(response, 'error.message', 'Ошибка при запросе')

    if (status === true) {
      return data
    } else {
      throw new Error(message)
    }
  }

  /**
   * Get api endpoint url
   *
   * @return {string}
   */
  getApiEndpoint () {
    const rawEndpoint = require('@store/index').default?.state?.app?.settings?.system?.api?.endpoint
    const endpoint = this.normalizeApiEndpoint(rawEndpoint)
    return endpoint + '/public/api/index.php'
  }

  /**
   * Get extended api endpoint url
   *
   * @param api_version - default value "v1"
   * @return {string}
   */
  getApiEndpointExtend (api_version = "v1") {
    const endpoint = require('@store/index').default?.state?.app?.settings?.system?.api?.ext_endpoint + `/api/${api_version}`
    return endpoint
  }

  /**
   * Get application update channel endpoint url
   *
   * @return {string}
   */
  getAppUpdateChannelEndpoint () {
    const endpoint = require('@store/index').default?.state?.app?.settings?.system?.api?.app_update_channel_endpoint
    return endpoint
  }

  getTorrentEndpoint () {
    const rawEndpoint = require('@store/index').default?.state?.app?.settings?.system?.api?.endpoint
    const endpoint = this.normalizeApiEndpoint(rawEndpoint)
    return endpoint
  }

  getApiLoginEndpoint () {
    const rawEndpoint = require('@store/index').default?.state?.app?.settings?.system?.api?.endpoint
    const endpoint = this.normalizeApiEndpoint(rawEndpoint)
    return endpoint + '/public/login.php'
  }

  getApiLogoutEndpoint () {
    const rawEndpoint = require('@store/index').default?.state?.app?.settings?.system?.api?.endpoint
    const endpoint = this.normalizeApiEndpoint(rawEndpoint)
    return endpoint + '/public/logout.php'
  }

  /**
   * Get static endpoint url
   *
   * @return {string}
   */
  getStaticEndpoint () {
    // eslint-disable-next-line camelcase
    const rawEndpoint = require('@store/index').default?.state?.app?.settings?.system?.api?.static_endpoint
    const endpoint = this.normalizeStaticEndpoint(rawEndpoint)
    return endpoint
  }

  /**
   * Get form data from provided data object
   *
   * @param data
   * @return {FormData}
   */
  getFormDataObject (data = null) {
    // Create form data object
    const formData = new FormData()

    // Set data
    Object.keys(data || {})
      .forEach(key => formData.append(key, typeof (data[key]) === 'object' ? JSON.stringify(data[key]) : data[key]))

    // Return form data
    return formData
  }

  /**
   * Get default request headers
   *
   * @return {{}}
   */
  getRequestHeaders () {
    // Create headers
    const headers = {}

    // Set header user agent
    headers['user-agent'] = `${meta.name}/${version}`

    // Set header session
    // Set session in cookies
    const session = __get(store, 'state.app.account.session')
    if (session && session.length > 0) {
      headers.Cookie = `PHPSESSID=${session}; Path=/; Secure; HttpOnly`
    }

    return headers
  }
}
