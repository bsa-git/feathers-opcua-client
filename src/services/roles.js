/* eslint-disable no-unused-vars */
const loPick = require('lodash/pick')
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '@/plugins/auth/feathers-client'
import normalize from '@/services/hooks/normalize';
import log from '@/services/hooks/log';

const debug = require('debug')('app:service.roles')
const isDebug = false

class Role extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Role'
  // Define default properties here
  static instanceDefaults(data, { store, models }) {
    const idField = store.state.users.idField
    if (isDebug && data) debug('ServiceInfo.data:', data)
    return {
      get users() {
        const { User } = models.api
        const roleId = data[idField]
        let users = User.findInStore({
          query: { roleId: roleId, $sort: { fullName: 1 } }
        }).data
        if (users.length) {
          users = users.map(user => {
            const id = user[idField]
            user = loPick(user, ['email', 'fullName', 'avatar'])
            user.id = id
            return user
          })
          if (isDebug && users) debug('users:', users)
          return users
        } else {
          return []
        }
      }
    }
  }
}

const servicePath = 'roles'
const servicePlugin = makeServicePlugin({
  Model: Role,
  service: feathersClient.service(servicePath),
  servicePath
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [log()],
    find: [],
    get: [],
    create: [normalize()],
    update: [normalize()],
    patch: [normalize()],
    remove: []
  },
  after: {
    all: [log()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [log()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
})

export default servicePlugin
