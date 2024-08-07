/* eslint-disable no-unused-vars */
import util from '@/plugins/lib/util'
import Service from '@/plugins/service-helpers/service-client.class'
const debug = require('debug')('app:store.actions')
const isDebug = true

const actions = {
  
  async checkAuth({ dispatch }) {
    if (isDebug) debug('<<checkAuth>>Start checkAuth')
    let result = false
    //--------------------
    if (util.isAccessToken()) {
      try {
        let response = await dispatch('authenticate')
        result = !!response && !!response.accessToken
        if (isDebug && result)
          debug('<<checkAuth>>Response accessToken:', response)
      } catch (error) {
        if (error.message.includes('Could not find stored JWT')) {
          util.removeAccessToken()
          if (isDebug) debug('<<checkAuth>>Error.message:', error.message)
          result = false
        } else if (error.message.includes('No record found for id')) {
          util.removeAccessToken()
          if (isDebug) debug('<<checkAuth>>Error.message:', error.message)
          result = false
        } else {
          result = false
          // console.error(error);
          if (isDebug) debug('<<checkAuth>>Error.message:', error.message)
          if (isDebug) debug('<<checkAuth>>Error:', result)
          throw error
        }
      }
    } else {
      result = false
    }
    if (isDebug) debug('<<checkAuth>>Result:', result)
    return result
  },

  async logout(store) {
    if (isDebug) debug('<<logout>> Start logout')
    const service = new Service(store)
    // logout
    await service.logout()
    // Remove access token
    if (util.isAccessToken) {
      util.removeAccessToken()
    }
    // service.clearAll();
    const isAuth = store.getters.isAuth
    const myRole = store.getters.getMyRole ? store.getters.getMyRole : 'No'
    if (isDebug)
      debug(
        `<<logout>> Logout completed; <<isAuth>>: ${isAuth}; <<myRole>>: ${myRole}`
      )
  },

  async authenticate(store, credentials = null) {
    if (isDebug && store) debug('<<authenticate>> Start authenticate')
    const service = new Service(store)

    // authenticate
    let response = await service.authenticate(credentials)
    if (isDebug && response) debug('service.authenticate.response:', response)
    if (response && response.accessToken) {
      const isAuth = store.getters.isAuth
      const isAdmin = store.getters.isAdmin
      // Set access token
      if (!util.isAccessToken) {
        util.setAccessToken(response.accessToken)
      }
      // if (isAdmin) {
      //   await service.findAllForAdmin();
      // } else {
      //   await service.findAllForUser();
      // }
      if (isDebug && response)
        debug(
          `<<authenticate>> Authenticate completed; <<isAuth>>: ${isAuth}; <<myRole>>: ${
            store.getters.getMyRole ? store.getters.getMyRole : 'No'
          }`
        )
    }
    return response
  }
}
export default actions
