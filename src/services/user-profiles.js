import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '@/plugins/auth/feathers-client'

const debug = require('debug')('app:service.user-profiles')
const isDebug = false

class UserProfile extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'UserProfile'
  // Define default properties here
  static instanceDefaults() {
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
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
})

export default servicePlugin