/* eslint-disable no-unused-vars */
const loPick = require('lodash/pick')
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '@/plugins/auth/feathers-client'
// import normalize from '~/services/hooks/normalize';
// import log from '~/services/hooks/log';

const debug = require('debug')('app:service.teams')
const isDebug = false

class Team extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Team'
  // Define default properties here
  static instanceDefaults(data, { store, models }) {
    const idField = store.state.roles.idField
    if (isDebug)
      debug('ServiceInfo:', {
        idField: idField,
        data: data
      })
    return {
      get members() {
        const { User, UserTeam } = models.api
        const teamId = data[idField]
        let userIdsForTeam = UserTeam.findInStore({
          query: { teamId: teamId, $sort: { userId: 1 } }
        }).data
        if (userIdsForTeam.length) {
          userIdsForTeam = userIdsForTeam.map(row => row.userId.toString())
          if (isDebug) debug('members.userIdsForTeam:', userIdsForTeam)
          let usersForTeam = User.findInStore({
            query: { [idField]: { $in: userIdsForTeam }, $sort: { fullName: 1 } }
          }).data
          usersForTeam = usersForTeam.map(user => {
            const id = user[idField]
            user = loPick(user, ['email', 'fullName', 'avatar'])
            user.id = id
            return user
          })
          if (isDebug) debug('members.usersForTeam:', usersForTeam)
          return usersForTeam
        } else {
          return []
        }

      }
    }
  }
}

const servicePath = 'teams'
const servicePlugin = makeServicePlugin({
  Model: Team,
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

const servicePath = 'teams';
const servicePlugin = service(servicePath, {
  instanceDefaults(data, {store, Model, Models}) {
    const idField = store.state.teams.idField;
    if (isDebug) debug('ServiceInfo:', {
      servicePath: Model.servicePath,
      namespace: Model.namespace,
      idField: idField,
      data: data
    });
    return {
      get members() {
        const idFieldUser = store.state.users.idField;
        const idFieldTeam = store.state.teams.idField;
        const teamId = data[idFieldTeam];
        let userIdsForTeam = Models.UserTeam.findInStore({query: {teamId: teamId, $sort: {userId: 1}}}).data;
        userIdsForTeam = userIdsForTeam.map(row => row.userId.toString());
        if(isDebug)debug('members.userIdsForTeam:', userIdsForTeam);
        let usersForTeam = Models.User.findInStore({query: {[idFieldUser]: {$in: userIdsForTeam}, $sort: {fullName: 1}}}).data;
        usersForTeam = usersForTeam.map(user => {
          const id = user[idFieldUser];
          user = loPick(user, ['email', 'fullName', 'avatar']);
          user.id = id;
          return user;
        });
        if(isDebug)debug('members.usersForTeam:', usersForTeam);
        return  usersForTeam;
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
