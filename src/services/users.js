/* eslint-disable no-unused-vars */
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '@/plugins/auth/feathers-client'

const debug = require('debug')('app:service.users')
const isDebug = true

class User extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'User'
  // Define default properties here
  static instanceDefaults(data, { store, models }) {
    // instanceDefaults(data, {store, Model, Models}) {

    // if (isDebug && params) debug('instanceDefaults.params:', params)
    const idField = store.state.users.idField
    if (isDebug && store)
      debug('instanceDefaults:', {
        // servicePath: Model.servicePath,
        // namespace: Model.namespace,
        idField: idField,
        data: data
      })

    // if (data.profileId) {
    //   const { UserProfile } = models.api
    //   let profile = UserProfile.getFromStore(data.profileId);
    //   if(profile){
    //     const id = profile[idField];
    //     // profile = loPick(profile, Service.serviceFields('userProfiles'), ['fullAddress']);
    //     profile.id = id;
    //   }
    //   if (isDebug && profile) debug('instanceDefaults.profile:', profile)
    // }

    return {
      email: '',
      password: '',
      get fullName() {
        return `${this.firstName} ${this.lastName}`
      },

      // get profile() {
      //   if (this.profileId) {
      //     const { UserProfile } = models.api
      //     // const idFieldProfile = store.state['user-profiles'].idField;
      //     let profile = UserProfile.getFromStore(this.profileId)
      //     if (profile) {
      //       const id = profile[idField]
      //       // profile = loPick(profile, Service.serviceFields('userProfiles'), ['fullAddress']);
      //       profile.id = id
      //     } else {
      //       profile = null
      //     }
      //     return profile
      //   } else {
      //     return null
      //   }
      // }
    }
  }
}
const servicePath = 'users'
const servicePlugin = makeServicePlugin({
  Model: User,
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
