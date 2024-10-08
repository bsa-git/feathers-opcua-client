import Service from '@/plugins/service-helpers/service-client.class'
import jsonLogData from '~/api/app/app-log-msg.json'

const debug = require('debug')('app:plugin.create-log-message')
const isDebug = false

/**
 * Create log message
 * @param name
 * @param params
 * @return {Promise.<*>}
 */
export default function createLogMessage(store) {
  return async (name = '', params = {}) => {
    let msg,
      data,
      selIds,
      ownerId,
      userId,
      result = null
    if (isDebug) debug('name:', name, 'params:', params)

    const service = new Service(store)

    // Log data
    const getLogData = name => {
      return jsonLogData
        .filter(item => !item.isConfig)
        .find(item => item.name === name)
    }
    const configLogData = jsonLogData.find(item => item.isConfig)
    const logData = getLogData(name)
    if (isDebug) debug('logData:', logData)

    // Get idField for user
    const idField = service.getServiceIdField('users')
    // Get ownerId/userId
    const authUser = service.getAuthUser()
    if (authUser) {
      ownerId = authUser[idField]
      userId = authUser[idField]
    } else {
      ownerId = service.getters.getDbNullIdValue
      userId = service.getters.getDbNullIdValue
    }

    // Not create log msg
    if (!logData.isEnable) return result
    if (configLogData.excludeGroups.includes(logData.gr)) return result

    // Create log msg
    switch (name) {
      // Log message remove
      case 'LOG-MESSAGE-REMOVE':
        if (Array.isArray(params.selected)) {
          selIds = params.selected.map(sel => sel.id)
        } else {
          selIds = [params.selected.id]
        }
        msg = {
          selected: selIds,
          email: authUser['email'],
          fullName: `${authUser['firstName']} ${authUser['lastName']}`
        }
        data = {
          gr: logData.gr,
          pr: logData.pr,
          name: logData.name,
          ownerId,
          userId,
          msg: JSON.stringify(msg)
        }
        break
      // Log message error
      case 'ERROR-CLIENT':
        // Get msg
        if (params.error.code) {
          msg = params.error
        } else {
          msg = { message: params.error.message }
        }
        // Get data
        data = {
          gr: logData.gr,
          pr: logData.pr,
          name: logData.name,
          ownerId,
          userId,
          msg: JSON.stringify(msg)
        }
        break
      default:
        break
    }
    if (data) {
      result = await service.create('log-messages', data)
    }
    if (isDebug && result) debug('createLogMsg.result:', result)
    return result
  }
}
