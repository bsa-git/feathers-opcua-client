/* eslint-disable no-unused-vars */
const loPick = require('lodash/pick')
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '@/plugins/auth/feathers-client'
// import normalize from '~/services/hooks/normalize';
// import log from '~/services/hooks/log';

const debug = require('debug')('app:service.log-messages')
const isDebug = false

/**
 * Get user for chat-message
 * @param userId
 * @param store
 * @param Models
 * @return {Object|null}
 */
const getUser = function(userId, store, models) {
  let _user = null
  const { User } = models.api
  const user = User.getFromStore(userId)
  if (user) {
    _user = loPick(user, ['fullName', 'email', 'avatar', 'roleAlias'])
    _user.id = userId
    _user.role = user.role
  }
  return _user
}

/**
 * Get team for chat-message
 * @param teamId
 * @param store
 * @param Models
 * @return {Object|null}
 */
const getTeam = function(teamId, store, models) {
  let team = null
  const { Team } = models.api
  team = Team.getFromStore(teamId)
  if (team) {
    team = loPick(team, ['name', 'description'])
    team.id = teamId
  }
  return team
}

/**
 * Get role for chat-message
 * @param roleId
 * @param store
 * @param Models
 * @return {Object|null}
 */
const getRole = function(roleId, store, models) {
  let role = null
  const { Role } = models.api
  role = Role.getFromStore(roleId)
  if (role) {
    role = loPick(role, ['name', 'description'])
    role.id = roleId
  }
  return role
}

class ChatMessage extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'ChatMessage'
  // Define default properties here
  static instanceDefaults(data, { store, models }) {
    let dt = ''
    const moment = require('moment')
    const dbNullIdValue = store.getters.getDbNullIdValue
    if (isDebug && data) debug('ServiceInfo.data:', data)
    return {
      get owner() {
        return this && this.ownerId
          ? getUser(this.ownerId, store, models)
          : null
      },
      get user() {
        return this && this.userId && this.userId !== dbNullIdValue
          ? getUser(this.userId, store, models)
          : null
      },
      get team() {
        return this && this.teamId && this.teamId !== dbNullIdValue
          ? getTeam(this.teamId, store, models)
          : null
      },
      get role() {
        return this && this.roleId && this.roleId !== dbNullIdValue
          ? getRole(this.roleId, store, models)
          : null
      },
      get dtUTC() {
        dt = moment.utc(this.createdAt).format()
        return dt
      },
      get dtLocal() {
        dt = moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
        return dt
      },
      get dtUpdatedAtLocal() {
        dt = moment(this.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        return dt
      }
    }
  }
}

const servicePath = 'chat-messages'
const servicePlugin = makeServicePlugin({
  Model: ChatMessage,
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

/*
const {service} = feathersVuex(feathersClient, {idField: '_id'});
const servicePath = 'chat-messages';
const servicePlugin = service(servicePath, {
  instanceDefaults(data, {store, Model, Models}) {
    let dt = '';
    const moment = require('moment');
    const idField = store.state[servicePath].idField;
    const dbNullIdValue = store.getters.getDbNullIdValue;
    if (isDebug) debug('ServiceInfo:', {
      servicePath: Model.servicePath,
      namespace: Model.namespace,
      idField: idField,
      data: data
    });
    return {
      get owner() {
        return (this && this.ownerId)? getUser(this.ownerId, store, Models) : null;
      },
      get user() {
        return (this && this.userId && this.userId !== dbNullIdValue)? getUser(this.userId, store, Models) : null;
      },
      get team() {
        return (this && this.teamId && this.teamId !== dbNullIdValue)? getTeam(this.teamId, store, Models) : null;
      },
      get role() {
        return (this && this.roleId && this.roleId !== dbNullIdValue)? getRole(this.roleId, store, Models) : null;
      },
      get dtUTC() {
        dt = moment.utc(this.createdAt).format();
        return dt;
      },
      get dtLocal() {
        dt = moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss');
        return dt;
      },
      get dtUpdatedAtLocal() {
        dt = moment(this.updatedAt).format('YYYY-MM-DD HH:mm:ss');
        return dt;
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
