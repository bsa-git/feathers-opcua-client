/* eslint-disable no-unused-vars */
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '@/plugins/auth/feathers-client'
import normalize from '@/services/hooks/normalize'
import log from '@/services/hooks/log'

const debug = require('debug')('app:service.user-profiles')
const isDebug = false

class UserProfile extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'UserProfile'
  // Define default properties here
  static instanceDefaults(data) {
    if (isDebug && data) debug('ServiceInfo.data:', data)

    return {
      get fullAddress() {
        const isFullAddress = !!this.addressCountry
        const fullAddress = isFullAddress
          ? `${this.addressStreet} ${this.addressSuite}, ${this.addressCity}, ${this.addressStateAbbr} ${this.addressZipCode}, ${this.addressCountry}`
          : ''
        if (isDebug && fullAddress) debug('fullAddress:', fullAddress)
        return fullAddress
      }
    }
  }
}
const servicePath = 'user-profiles'
const servicePlugin = makeServicePlugin({
  Model: UserProfile,
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
