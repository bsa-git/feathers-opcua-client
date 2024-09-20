/* eslint-disable no-unused-vars */
const loPick = require('lodash/pick')
const commonHooks = require('feathers-hooks-common')
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '@/plugins/auth/feathers-client'
import Service from '@/plugins/service-helpers/service-client.class'
import normalize from '@/services/hooks/normalize'
import log from '@/services/hooks/log'

const debug = require('debug')('app:service.users')
const isDebug = false

class User extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'User'
  // Define default properties here
  static instanceDefaults(data, { store, models }) {
    const idField = store.state.users.idField
    if (isDebug && data) debug('ServiceInfo.data:', data)
    return {
      email: '',
      password: '',
      get fullName() {
        return `${this.firstName} ${this.lastName}`
      },
      get profile() {
        if (this.profileId) {
          const { UserProfile } = models.api
          let profile = UserProfile.getFromStore(this.profileId)
          if (profile) {
            const id = profile[idField]
            profile = loPick(profile, Service.serviceFields('userProfiles'), [
              'fullAddress'
            ])
            profile.id = id
          } else {
            profile = null
          }
          return profile
        } else {
          return null
        }
      },
      get role() {
        if (this.roleId) {
          const { Role } = models.api
          let role = Role.getFromStore(this.roleId)
          if (role) {
            const id = role[idField]
            role = loPick(role, Service.serviceFields('roles'))
            role.id = id
            role.isAdmin = store.getters.isAdmin
          } else {
            role = null
          }
          return role
        } else {
          return null
        }
      },
      get teams() {
        const { Team, UserTeam } = models.api
        const userId = data[idField]
        let teamIdsForUser = UserTeam.findInStore({
          query: { userId: userId, $sort: { teamId: 1 } }
        }).data
        if (teamIdsForUser.length) {
          teamIdsForUser = teamIdsForUser.map(row => row.teamId.toString())
          let teamsForUser = Team.findInStore({
            query: { [idField]: { $in: teamIdsForUser }, $sort: { name: 1 } }
          }).data
          teamsForUser = teamsForUser.map(team => {
            const id = team[idField]
            team = loPick(team, Service.serviceFields('teams'))
            team.id = id
            return team
          })
          if (isDebug && teamsForUser)
            debug('teams.teamsForUser:', teamsForUser)
          return teamsForUser
        } else {
          return []
        }
      }
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
    all: [log()],
    find: [],
    get: [],
    create: [normalize()],
    update: [normalize()],
    patch: [
      normalize(),
      commonHooks.discard(
        'isVerified',
        'verifyToken',
        'verifyShortToken',
        'verifyExpires',
        'verifyChanges',
        'resetToken',
        'resetShortToken',
        'resetExpires',
        'googleId',
        'githubId',
        'googleAccessToken',
        'googleRefreshToken',
        'githubAccessToken',
        'githubRefreshToken'
      )
    ],
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
