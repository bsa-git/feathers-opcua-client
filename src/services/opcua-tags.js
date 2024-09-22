/* eslint-disable no-unused-vars */
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '@/plugins/auth/feathers-client'
import normalize from '@/services/hooks/normalize'
import log from '@/services/hooks/log'

const debug = require('debug')('app:service.opcua-tags')
const isDebug = false

class OpcuaTag extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'OpcuaTag'
  // Define default properties here
  static instanceDefaults(data) {
    if (isDebug && data) debug('ServiceInfo.data:', data)
    return {}
  }
}

const servicePath = 'opcua-tags'
const servicePlugin = makeServicePlugin({
  Model: OpcuaTag,
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

/*
const {service} = feathersVuex(feathersClient, {idField: '_id'});

const servicePath = 'opcua-tags';
// const userTeams = feathersClient(servicePath);
// userTeams.on('patched', userTeam => console.log('User team patched', userTeam));
const servicePlugin = service(servicePath, {
  instanceDefaults(data, {store, Model}) {
    const idField = store.state['opcua-tags'].idField;
    if (isDebug) debug('ServiceInfo:', {
      servicePath: Model.servicePath,
      namespace: Model.namespace,
      idField: idField,
      data: data
    });
    return {};
  },
  getters: {},
});

feathersClient.service(servicePath)
  .hooks({
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
  });

export default servicePlugin;
*/
