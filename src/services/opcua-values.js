/* eslint-disable no-unused-vars */
const loPick = require('lodash/pick')
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '@/plugins/auth/feathers-client'
import normalize from '@/services/hooks/normalize'
import log from '@/services/hooks/log'

const debug = require('debug')('app:service.opcua-values')
const isDebug = false

class OpcuaValue extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'OpcuaValue'
  // Define default properties here
  static instanceDefaults(data, { store, models }) {
    const idField = store.state.users.idField
    if (isDebug && data) debug('ServiceInfo.data:', data)
    return {
      get tag() {
        if (this.tagId) {
          const { OpcuaTag } = models.api
          let tag = OpcuaTag.getFromStore(this.tagId)
          if (tag) {
            const id = tag[idField]
            const defaultFields = [
              'browseName',
              'displayName',
              'ownerName',
              'type',
              'dataType'
            ]
            tag = loPick(
              tag,
              defaultFields,
              tag.type === 'variable.analog' ? ['aliasName', 'valueParams'] : []
            )
            tag.id = id
          } else {
            tag = null
          }
          return tag
        } else {
          return null
        }
      }
    }
  }
}

const servicePath = 'opcua-values'
const servicePlugin = makeServicePlugin({
  Model: OpcuaValue,
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
const { service } = feathersVuex(feathersClient, { idField: '_id' });

const servicePath = 'opcua-values';
const servicePlugin = service(servicePath, {
  instanceDefaults(data, { store, Model, Models }) {
    const idField = store.state['opcua-values'].idField;
    if (isDebug) debug('ServiceInfo:', {
      servicePath: Model.servicePath,
      namespace: Model.namespace,
      idField: idField,
      data: data
    });
    return {
      get tag() {
        if (this.tagId) {
          const idFieldOpcuaTag = store.state['opcua-tags'].idField;
          let tag = Models.OpcuaTag.getFromStore(this.tagId);
          if (tag) {
            const id = tag[idFieldOpcuaTag];
            const defaultFields = ['browseName', 'displayName', 'ownerName', 'type', 'dataType'];
            tag = loPick(tag, defaultFields, tag.type === 'variable.analog' ? ['aliasName', 'valueParams'] : []);
            tag.id = id;
          } else {
            tag = null;
          }
          return tag;
        } else {
          return null;
        }
      },
    };
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
