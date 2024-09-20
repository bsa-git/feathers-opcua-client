/* eslint-disable no-unused-vars */
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '@/plugins/auth/feathers-client'
import normalize from '@/services/hooks/normalize';
import log from '@/services/hooks/log';

const debug = require('debug')('app:service.user-teams')
const isDebug = false

class UserTeam extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'UserTeam'
  // Define default properties here
  static instanceDefaults(data) {
    if (isDebug && data) debug('ServiceInfo.data:', data)

    return {
      getters: {}
    }
  }
}

const servicePath = 'user-teams'
const servicePlugin = makeServicePlugin({
  Model: UserTeam,
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

const servicePath = 'user-teams';
// const userTeams = feathersClient(servicePath);
// userTeams.on('patched', userTeam => console.log('User team patched', userTeam));
const servicePlugin = service(servicePath, {
  instanceDefaults(data, { store, Model }) {
    const idField = store.state['user-teams'].idField;
    if (isDebug) debug('ServiceInfo:', {
      servicePath: Model.servicePath,
      namespace: Model.namespace,
      idField: idField,
      data: data
    });
    return {};
  },
  getters: {
    userIdsForTeam: (state, getters) => (teamId = null) => {
      const _usersForTeam = getters.find({ query: { teamId: teamId, $sort: { userId: 1 } } }).data;
      return _usersForTeam.map(row => row.userId.toString());
    },
    teamIdsForUser: (state, getters) => (userId = null) => {
      // const _teamsForUser = getters.find({query: {userId: userId, $sort: {teamId: 1}}}).data;
      const _teamsForUser = getters.find({ query: { userId: userId } }).data;
      return (_teamsForUser && _teamsForUser.lenth) ? _teamsForUser.map(row => row.teamId.toString()) : [];
    },
  },
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
