import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '../../feathers-client'
import { format } from 'date-fns'

const debug = require('debug')('app:service.messages')

const isDebug = false

class Message extends BaseModel {
  constructor(data, options) {
    super(data, options)
    if (isDebug) debug('Message.options:', options)
    if (isDebug) debug('Message.data:', data)
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Message'

  // Define default properties here
  static instanceDefaults() {
    return {
      text: ''
    }
  }

  static setupInstance(data, { store, models }) {
    const idFieldUser = store.state.users.idField
    if (isDebug) debug('Message.setupInstance.idFieldUser:', idFieldUser)
    if (true && models) debug('Message.setupInstance.models:', models)
    if (data.createdAt) {
      data.createdAt = new Date(data.createdAt)
      data.formattedDate = format(data.createdAt, 'MMM do, hh:mm:ss')
    }
    return data
  }
}

const servicePath = 'messages'
const servicePlugin = makeServicePlugin({
  Model: Message,
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
