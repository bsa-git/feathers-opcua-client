/* eslint-disable no-unused-vars */
import fakeData from '@/seeds/fake-data.json'
import util from '@/plugins/lib/util'
import moment from 'moment'
const loKebabCase = require('lodash/kebabCase')
const loMerge = require('lodash/merge')
// const errors = require('@feathersjs/errors');
import Vue from 'vue'
import { abilitiesPlugin } from '@casl/vue'
import { defineAbilitiesFor } from '../auth/abilities'

const debug = require('debug')('app:plugins.service-client.class')
let isDebug = false

class Service {
  /**
   * Constructor
   * @param store
   */
  constructor(store) {
    this.store = store
    this.state = store.state
    this.getters = store.getters
    this.dispatch = store.dispatch
    this.commit = store.commit
    this.config = store.getters.getConfig
    const { auth } = store.state
    this.user = auth.user
    if (isDebug) debug('Created.OK')
  }

  /**
   * Get service fields
   * @param serviceName
   * @param isId
   * @return {Array.<*>}
   */
  static serviceFields(serviceName = '', isId = false) {
    let serviceFakeData = {}
    //--------------------------------------
    if (serviceName === 'opcuaTags') {
      fakeData[serviceName].forEach(item =>
        Object.assign(serviceFakeData, item)
      )
    } else {
      serviceFakeData = fakeData[serviceName][0]
    }
    const idField = 'id' in serviceFakeData ? 'id' : '_id'
    const fields = Object.keys(serviceFakeData).filter(key =>
      isId ? true : key !== idField
    )
    if (isDebug) debug('serviceFields.fields:', fields)
    return fields
  }

  /**
   * Get service paths
   * @return {Array}
   */
  static getServicePaths() {
    const paths = Object.keys(fakeData).map(key =>
      loKebabCase(key).toLowerCase()
    )
    if (isDebug) debug('getServicePaths:', paths)
    return paths
  }

  /**
   * Get service id field
   * @param path {String}
   * @return {string}
   */
  getServiceIdField(path = '') {
    return this.state[path].idField
  }

  /**
   * Authenticate
   * @param credentials
   * @return {Promise.<*>}
   */
  async authenticate(credentials = null) {
    let result
    if (credentials) {
      result = await this.dispatch('auth/authenticate', credentials)
    } else {
      result = await this.dispatch('auth/authenticate')
    }
    if(result.user){
      this.updateAbilityForUser(result.user)
    }
    if (isDebug && result) debug('authenticate: OK', 'result:', result)
    return result
  }

  /**
   * Logout
   * @return {Promise.<void>}
   */
  async logout() {
    await this.dispatch('auth/logout')
    if (isDebug) debug('logout: OK')
  }

  /**
   * updateAbilityForUser
   * @param {Object} currentUser
   */
  updateAbilityForUser(currentUser) {
    const ability = defineAbilitiesFor(currentUser)
    if (true && ability) debug('updateAbilityForUser.ability:', ability)
    // Vue.use(abilitiesPlugin, ability, { useGlobalProperties: true })
    Vue.use(abilitiesPlugin, ability)
  }

  /**
   * Get auth user
   */
  getAuthUser() {
    const user = this.state.auth.user
    if (isDebug) debug('getUser:', user)
    return user
  }

  /**
   * Get auth user id
   */
  getAuthUserId() {
    const user = this.getAuthUser()
    const idField = user ? this.getServiceIdField('users') : ''
    return idField ? user[idField] : ''
  }

  /**
   * Clear all services from store
   */
  clearAll() {
    const paths = Service.getServicePaths()
    paths.forEach(path => this.commit(`${path}/clearAll`))
    if (isDebug) debug('clearAll: OK')
  }

  /**
   * Get user for userId
   * @param userId
   * @return {Promise.<void>}
   */
  async getUserForUserId(userId) {
    if (!this.getFromStore('users', userId)) {
      const user = await this.get('users', userId)
      await this.get('user-profiles', user.profileId)
      if (!this.getFromStore('roles', user.roleId)) {
        await this.get('roles', user.roleId)
      }
    }
  }

  /**
   * Find all services for admin user
   * @return {Promise.<void>}
   */
  async findAllForAdmin() {
    if (isDebug) debug('findAllForAdmin: START')
    // Find chat messages for user
    const user = this.getAuthUser()
    if (user) {
      const paths = Service.getServicePaths().filter(
        path => path !== 'chat-messages'
      )
      if (isDebug && paths.length) debug('findAllForAdmin.paths:', paths)
      for (let index = 0; index < paths.length; index++) {
        const path = paths[index]
        const result = await this.findAll(path, { query: {} })
        if (isDebug && result)
          debug(`findAllForAdmin.result for "${path}":`, result)
      }
      // Find all chat messages for admin
      await this.findChatMessagesForAdmin(user)
      this.initStateChatCheckAt()
    }
  }

  /**
   * Find all chat messages for admin
   * @param user {Object}
   * @return {Promise.<void>}
   */
  async findChatMessagesForAdmin(user) {
    const idField = this.getServiceIdField('users')
    const userId = user[idField]
    // getTeamIdsForUser
    const teamIdsForUser = this.getters.getTeamIdsForUser(userId)
    if (isDebug && teamIdsForUser)
      debug('findChatMessagesForAdmin.teamIdsForUser:', teamIdsForUser)
    // Find chat-messages
    const result = await this.findAll('chat-messages', {
      query: {
        $or: [
          { ownerId: userId },
          { userId: userId },
          { roleId: user.roleId },
          { teamId: { $in: teamIdsForUser } }
        ]
      }
    })
    if (isDebug && result)
      debug('findChatMessagesForAdmin.result for "chat-messages":', result)
  }

  /**
   * Find all services for auth user
   * @return {Promise.<void>}
   */
  async findAllForUser() {
    let results
    if (isDebug) debug('findAllForUser: START')
    const user = this.getAuthUser()
    if (user) {
      const idField = this.state.users.idField

      // getUserProfiles
      results = await this.get('user-profiles', user.profileId)
      if (isDebug && results)
        debug('findAllForUser.user-profiles.get:', results)

      // getRole
      results = await this.get('roles', user.roleId)
      if (isDebug && results) debug('findAllForUser.role for user:', results)
      results = await this.find('roles', {
        query: { alias: 'isAdministrator' }
      })
      if (isDebug && results)
        debug('findAllForUser.roles for administrators:', results)

      // getTeams
      const userId = user[idField]

      // Find teams for user
      let teamIdsForUser = await this.findAll('user-teams', {
        query: { userId: userId, $sort: { teamId: 1 } }
      })
      teamIdsForUser = teamIdsForUser.map(row => row.teamId.toString())
      if (isDebug && teamIdsForUser)
        debug('findAllForUser.teamIdsForUser:', teamIdsForUser)
      if (teamIdsForUser.length) {
        results = await this.findAll('teams', {
          query: { [idField]: { $in: teamIdsForUser }, $sort: { name: 1 } }
        })
        if (isDebug && results) debug('findAllForUser.teams:', results)
      }

      // Find log messages
      let logMessages = await this.findAll('log-messages', {
        query: { userId: userId }
      })
      logMessages = logMessages.filter(msg => msg.ownerId !== msg.userId)
      if (isDebug && logMessages.length)
        debug('findAllForUser.logMessages:', logMessages)
      if (logMessages.length) {
        let ownerIds = logMessages.map(msg => msg.ownerId)
        // Get users for log-messages ownerIds
        for (let i = 0; i < ownerIds.length; i++) {
          const ownerId = ownerIds[i]
          await this.getUserForUserId(ownerId)
        }
      }
      // Find chat messages for user
      results = await this.findChatMessagesForUser(user)
      if (isDebug && results)
        debug('findAllForUser.findChatMessagesForUser:', results)
      // Init state chat checkAt
      this.initStateChatCheckAt()
      // Find all opcua tags
      results = await this.findAll('opcua-tags', { query: {} })
      if (isDebug && results) debug('findAllForUser.opcua-tags:', results)
      // Find all opcua values
      results = await this.findAll('opcua-values', { query: {} })
      if (isDebug && results) debug('findAllForUser.opcua-values:', results)
    }
  }

  /**
   * Find all chat messages for user
   * @param user {Object}
   * @return {Promise.<void>}
   */
  async findChatMessagesForUser(user) {
    const idField = this.getServiceIdField('users')
    const authUserId = user[idField]
    // Find chat messages
    const teamIdsForUser = this.getters.getTeamIdsForUser(authUserId)
    const chatMessages = await this.findAll('chat-messages', {
      query: {
        $or: [
          { ownerId: authUserId },
          { userId: authUserId },
          { roleId: user.roleId },
          { teamId: { $in: teamIdsForUser } }
        ]
      }
    })
    // Get users for chatMessages
    for (let i = 0; i < chatMessages.length; i++) {
      const msg = chatMessages[i]
      const msgOwnerId = msg['ownerId']
      const msgUserId = msg['user'] ? msg['userId'] : null
      if (
        msgOwnerId !== authUserId &&
        !this.getFromStore('users', msgOwnerId)
      ) {
        await this.getUserForUserId(msgOwnerId)
      }
      if (
        msgUserId &&
        msgUserId !== authUserId &&
        !this.getFromStore('users', msgUserId)
      ) {
        await this.getUserForUserId(msgUserId)
      }
    }
  }

  /**
   * Find chat messages for role
   * @param roleId
   * @return {Promise.<void>}
   */
  async findChatMessagesForRole(roleId) {
    const idUserField = this.getServiceIdField('users')
    const authUser = this.getAuthUser()
    const authUserId = authUser[idUserField]
    // Find chat messages
    if (!this.getFromStore('roles', roleId)) {
      await this.get('roles', roleId)

      let chatMessages = this.findInStore('chat-messages', {
        query: { roleId: roleId }
      })
      if (!chatMessages.length) {
        chatMessages = await this.find('chat-messages', {
          query: { roleId: roleId }
        })
        // Get users for chatMessages
        for (let i = 0; i < chatMessages.length; i++) {
          const msg = chatMessages[i]
          const msgOwnerId = msg['ownerId']
          const msgUserId = msg['user'] ? msg['userId'] : null
          if (
            msgOwnerId !== authUserId &&
            !this.getFromStore('users', msgOwnerId)
          ) {
            await this.getUserForUserId(msgOwnerId)
          }
          if (
            msgUserId &&
            msgUserId !== authUserId &&
            !this.getFromStore('users', msgUserId)
          ) {
            await this.getUserForUserId(msgUserId)
          }
        }
      }
    }
  }

  /**
   * Find chat messages for team
   * @param teamId
   * @return {Promise.<void>}
   */
  async findChatMessagesForTeam(teamId) {
    const idUserField = this.getServiceIdField('users')
    const authUser = this.getAuthUser()
    const authUserId = authUser[idUserField]
    // Find chat messages
    if (!this.getFromStore('teams', teamId)) {
      await this.get('teams', teamId)

      let chatMessages = this.findInStore('chat-messages', {
        query: { teamId: teamId }
      })
      if (!chatMessages.length) {
        chatMessages = await this.find('chat-messages', {
          query: { teamId: teamId }
        })
        // Get users for chatMessages
        for (let i = 0; i < chatMessages.length; i++) {
          const msg = chatMessages[i]
          const msgOwnerId = msg['ownerId']
          const msgUserId = msg['user'] ? msg['userId'] : null
          if (
            msgOwnerId !== authUserId &&
            !this.getFromStore('users', msgOwnerId)
          ) {
            await this.getUserForUserId(msgOwnerId)
          }
          if (
            msgUserId &&
            msgUserId !== authUserId &&
            !this.getFromStore('users', msgUserId)
          ) {
            await this.getUserForUserId(msgUserId)
          }
        }
      }
    }
  }

  /**
   * Init state chat checkAt
   */
  initStateChatCheckAt() {
    let idField = '_id'

    const authUser = this.getAuthUser()
    if (!authUser) return

    // Get chat users
    const users = this.getChatUsers()
    idField = this.getServiceIdField('users')
    users.forEach(user => {
      const userId = user[idField]
      this.getChatDTCheckAt('user', userId)
    })
    // Get chat roles
    const roles = this.getChatRoles()
    idField = this.getServiceIdField('roles')
    roles.forEach(role => {
      const roleId = role[idField]
      this.getChatDTCheckAt('role', roleId)
    })
    // Get chat teams
    const teams = this.getChatTeams()
    idField = this.getServiceIdField('teams')
    teams.forEach(team => {
      const teamId = team[idField]
      this.getChatDTCheckAt('team', teamId)
    })
  }

  /**
   * Get new chat messages
   */
  getNewChatMessages() {
    let idField = '_id',
      count = 0,
      dtCheckAt = '',
      messages = []
    let msgInfo = {}

    const authUser = this.getAuthUser()
    if (!authUser) return count

    // Get chat users
    const users = this.getChatUsers()
    users.forEach(user => {
      idField = this.state.users.idField
      const userId = user[idField]
      messages = this.getChatMessages().filter(msg =>
        this.isUserChatMsg(userId, msg)
      )
      if (messages.length) {
        dtCheckAt = this.getChatDTCheckAt('user', userId)
        msgInfo = this.getChatMsgInfo(messages, dtCheckAt)
        if (msgInfo.countMsg) {
          count += msgInfo.countMsg
        }
      }
    })
    // Get chat roles
    const roles = this.getChatRoles()
    roles.forEach(role => {
      idField = this.state.roles.idField
      const roleId = role[idField]
      messages = this.getChatMessages().filter(msg =>
        this.isRoleChatMsg(roleId, msg)
      )
      if (messages.length) {
        dtCheckAt = this.getChatDTCheckAt('role', roleId)
        msgInfo = this.getChatMsgInfo(messages, dtCheckAt)
        if (msgInfo.countMsg) {
          count += msgInfo.countMsg
        }
      }
    })
    // Get chat teams
    const teams = this.getChatTeams()
    teams.forEach(team => {
      const idField = this.state.teams.idField
      const teamId = team[idField]
      messages = this.getChatMessages().filter(msg =>
        this.isTeamChatMsg(teamId, msg)
      )
      if (messages.length) {
        dtCheckAt = this.getChatDTCheckAt('team', teamId)
        msgInfo = this.getChatMsgInfo(messages, dtCheckAt)
        if (msgInfo.countMsg) {
          count += msgInfo.countMsg
        }
      }
    })
    return count
  }

  /**
   * Get chat users
   * @return {Array}
   */
  getChatUsers() {
    let users = this.findInStore('users', { query: { $sort: { fullName: 1 } } })
    // let users = this.findInStore('users', { query: { } });
    // debug('getChatUsers.users:', users);
    // util.sortByStringField(users, 'fullName');
    users = users.filter(user => this.isChatFilterUser(user))
    return users
  }

  /**
   * Get chat roles
   * @return {Array}
   */
  getChatRoles() {
    let roles = this.findInStore('roles', { query: { $sort: { name: 1 } } })
    // let roles = this.findInStore('roles', { query: { } });
    // util.sortByStringField(roles, 'name');
    roles = roles.filter(role => this.isChatFilterRole(role))
    return roles
  }

  /**
   * Get chat teams
   * @return {Array}
   */
  getChatTeams() {
    let teams = this.findInStore('teams', { query: { $sort: { name: 1 } } })
    // let teams = this.findInStore('teams', { query: { } });
    // util.sortByStringField(teams, 'name');
    teams = teams.filter(team => this.isChatFilterTeam(team))
    return teams
  }

  /**
   * Get chat messages
   * @return {Array}
   */
  getChatMessages() {
    let messages = this.findInStore('chat-messages', {
      query: { $sort: { createdAt: 1 } }
    })
    // let messages = this.findInStore('chat-messages', { query: { } });
    // util.sortByStringField(messages, 'createdAt');
    messages = messages.filter(msg => this.isChatFilterMsg(msg))
    return messages
  }

  /**
   * Is user chat msg filter
   * @param userId
   * @param msg {Object}
   * @return {boolean}
   */
  isUserChatMsg(userId, msg) {
    let result = false
    const idField = this.state.users.idField
    const authUser = this.getAuthUser()
    const authUserId = authUser[idField]
    const msgUserId = msg.user ? msg.userId : null
    // I wrote to the selected user || The selected user wrote to me
    if (msgUserId) {
      result =
        (userId === msgUserId && authUserId === msg.ownerId) ||
        (userId === msg.ownerId && authUserId === msgUserId)
    }
    return result
  }

  /**
   * Is team chat msg filter
   * @param teamId
   * @param msg {Object}
   * @return {boolean}
   */
  isTeamChatMsg(teamId, msg) {
    let result = false
    const idField = this.state.users.idField
    const authUser = this.getAuthUser()
    const authUserId = authUser[idField]
    const msgTeamId = msg.team ? msg.teamId : null
    // I wrote to the selected team || I am a member of the selected team
    if (teamId === msgTeamId) {
      result =
        this.getters.isMyTeam(authUserId, teamId) || authUserId === msg.ownerId
    }
    return result
  }

  /**
   * Is role chat msg filter
   * @param roleId
   * @param msg {Object}
   * @return {boolean}
   */
  isRoleChatMsg(roleId, msg) {
    let result = false
    const idField = this.state.users.idField
    const authUser = this.getAuthUser()
    const authUserId = authUser[idField]
    const msgRoleId = msg.role ? msg.roleId : null
    // I wrote to the selected role || This is my role
    if (roleId === msgRoleId) {
      result = authUser.roleId === roleId || authUserId === msg.ownerId
    }
    return result
  }

  /**
   * Is chat filter role
   * @param role {Object}
   * @return {boolean}
   */
  isChatFilterRole(role) {
    const idField = this.state.roles.idField
    const authUser = this.getAuthUser()
    const isRole =
      authUser.roleAlias === 'isAdministrator'
        ? true
        : role[idField] === authUser.roleId
    return role.alias === 'isAdministrator' || isRole
  }

  /**
   * Is chat filter team
   * @param team {Object}
   * @return {boolean}
   */
  isChatFilterTeam(team) {
    const idTeamField = this.state.teams.idField
    const idUserField = this.state.users.idField
    const authUser = this.getAuthUser()
    const isTeam =
      authUser.roleAlias === 'isAdministrator'
        ? true
        : this.getters.isMyTeam(authUser[idUserField], team[idTeamField])
    return isTeam
  }

  /**
   * Is chat filter user
   * @param user {Object}
   * @return {boolean}
   */
  isChatFilterUser(user) {
    const idField = this.state.users.idField
    const authUser = this.getAuthUser()
    const authUserId = authUser[idField]
    const userId = user[idField]
    const messages = this.getChatMessages()
    const msgOwnerIds = messages.map(msg => msg.ownerId)
    const msgUserIds = messages.filter(msg => !!msg.user).map(msg => msg.userId)
    const isMsgOwner = msgOwnerIds.findIndex(id => id === userId) > -1
    const isMsgUser = msgUserIds.findIndex(id => id === userId) > -1
    return userId !== authUserId && (isMsgOwner || isMsgUser)
  }

  /**
   * Is chat filter msg
   * @param msg {Object}
   * @return {boolean|*}
   */
  isChatFilterMsg(msg) {
    const idField = this.state.users.idField
    const authUser = this.getAuthUser()
    const authUserId = authUser[idField]
    const isMsgOwner = msg.ownerId === authUserId
    const isMsgUser = msg.userId === authUserId
    const isMsgRole = msg.roleId === authUser.roleId
    const isMsgTeam = this.getters.isMyTeam(authUserId, msg.teamId)
    return isMsgOwner || isMsgUser || isMsgRole || isMsgTeam
  }

  /**
   * Get chat dateTime checkAt
   * @param name {String}
   * @param id
   * @param commitCheckAt {Boolean}
   * @return {String}
   */
  getChatDTCheckAt(name, id, commitCheckAt = false) {
    let _item,
      items = [],
      isStateChatCheckAt = false
    let dtCheckAt = moment.utc(0).format()

    // Get items from stateChatCheckAt
    let stateChatCheckAt = this.getters.getChat.checkAt
    if (stateChatCheckAt) {
      items = JSON.parse(stateChatCheckAt)
    }

    // Get dtCheckAt from stateChatCheckAt
    if (items.length) {
      isStateChatCheckAt =
        items.filter(item => item.name === name && item.id === id).length > 0
    }
    if (isStateChatCheckAt) {
      _item = items.filter(item => item.name === name && item.id === id)[0]
      if (commitCheckAt) {
        _item.checkAt = moment.utc().format()
        // Set state chat checkat
        this.commit('SET_CHAT_CHECKAT', items)
      }
      dtCheckAt = _item.checkAt
    } else {
      _item = { name, id, checkAt: dtCheckAt }
      items.push(_item)
      // Set state chat checkat
      this.commit('SET_CHAT_CHECKAT', items)
    }
    return dtCheckAt
  }

  /**
   * Get chat msg info
   * @param messages {Array}
   * @param dtCheckAt {String}
   * @return {Object}
   */
  getChatMsgInfo(messages, dtCheckAt) {
    let msgInfo = {}
    let _messages = []
    msgInfo.countAll = messages.length
    // Filter messages
    _messages = messages.filter(msg => msg.dtUTC >= dtCheckAt)

    // Get msgInfo
    msgInfo.timeLabel = _messages.length
      ? moment(_messages[0].dt).fromNow()
      : ''
    msgInfo.countMsg = _messages.length ? _messages.length : 0
    msgInfo.lastMsg = _messages.length ? _messages[0].msg : ''

    return msgInfo
  }

  //==============================================================================================//

  /**
   * Find method, which is a proxy to the find action
   * @async
   *
   * @param {String} path
   * @param {Object} params
   * @return {Object[]}
   */
  async find(path, params = {}) {
    let results
    //--------------------
    if (params.query) {
      results = await this.dispatch(`${path}/find`, params)
    } else {
      results = await this.dispatch(`${path}/find`, { query: params })
    }
    results = results.data || results
    if (isDebug)
      debug(
        `find.path: ${path}`,
        `find.params: ${JSON.stringify(params)}`,
        'find.results:',
        results
      )
    return results
  }

  /**
   * Find count method, which is a proxy to the find action
   *  @async
   *
   * @param {String} path
   * @param {Object} params
   * @return {Number}
   */
  async findCount(path, params = {}) {
    let newParams, results
    //--------------------
    if (params.query) {
      newParams = loMerge({}, params, { query: { $limit: 0 } })
    } else {
      newParams = loMerge({}, params, { $limit: 0 })
      newParams = { query: newParams }
    }
    results = await this.dispatch(`${path}/find`, newParams)
    results = results.total
    if (isDebug)
      debug(
        `findCount.path: ${path}`,
        `findCount.params: ${JSON.stringify(newParams)}`,
        'findCount.results:',
        results
      )
    return results
  }

  /**
   * Find all method, which is a proxy to the find action
   * @async
   *
   * @param {String} path
   * @param {Object} params
   * @return {Object[]}
   */
  async findAll(path, params = {}) {
    let newParams, results
    //--------------------
    if (params.query) {
      newParams = loMerge({}, params, { query: { $limit: null } })
    } else {
      newParams = loMerge({}, params, { $limit: null })
      newParams = { query: newParams }
    }
    results = await this.dispatch(`${path}/find`, newParams)
    if (isDebug && results)
      debug(
        `findAll.path: ${path}`,
        `findAll.params: ${JSON.stringify(newParams)}`,
        'findAll.results:',
        results
      )
    results = results.data || results
    return results
  }

  /**
   * findInStore method, which is a proxy to the find getter
   * @param {String} path
   * @param {Object} params
   * @return {Object[]}
   */
  findInStore(path, params = {}) {
    let results
    //--------------------
    if (params.query) {
      results = this.getters[`${path}/find`](params)
    } else {
      results = this.getters[`${path}/find`]({ query: params })
    }
    results = results.data || results
    if (isDebug && results)
      debug(
        `findInStore.path: ${path}`,
        `findInStore.params: ${JSON.stringify(params)}`,
        'findInStore.results:',
        results
      )
    return results
  }

  /**
   * findCountInStore method, which is a proxy to the find getter
   * @param {String} path
   * @param {Object} params
   * @return {Number}
   */
  findCountInStore(path, params = {}) {
    let newParams, results
    //--------------------
    if (params.query) {
      newParams = loMerge({}, params, { query: { $limit: 0 } })
    } else {
      newParams = loMerge({}, params, { $limit: 0 })
      newParams = { query: newParams }
    }
    results = this.getters[`${path}/find`](newParams)
    results = results.total
    if (isDebug && results)
      debug(
        `findCountInStore.path: ${path}`,
        `findCountInStore.params: ${JSON.stringify(newParams)}`,
        'findCountInStore.results:',
        results
      )
    return results
  }

  /**
   * findAllInStore method, which is a proxy to the find getter
   * @param {String} path
   * @param {Object} params
   * @return {Object[]}
   */
  findAllInStore(path, params = {}) {
    let newParams, results
    //--------------------
    if (params.query) {
      newParams = loMerge({}, params, { query: { $limit: null } })
    } else {
      newParams = loMerge({}, params, { $limit: null })
      newParams = { query: newParams }
    }
    results = this.getters[`${path}/find`](newParams)
    results = results.data || results
    if (isDebug && results)
      debug(
        `findAllInStore.path: ${path}`,
        `findAllInStore.params: ${JSON.stringify(newParams)}`,
        'findAllInStore.results:',
        results
      )
    return results
  }

  /**
   * Get method, which is a proxy to the get action
   * @async
   *
   * @param {String} path
   * @param {String} id
   * @param {Object} params
   * @return {Object}
   */
  async get(path, id, params = {}) {
    let results = await this.dispatch(`${path}/get`, id, params)
    if (isDebug && results)
      debug(`get.path: ${path}`, `get.id: ${id}`, 'get.results:', results)
    return results
  }

  /**
   * getFromStore method, which is a proxy to the get getter
   * @param {String} path
   * @param {String} id
   * @param {Object} params
   * @return {Object}
   */
  getFromStore(path, id, params = {}) {
    let results = this.getters[`${path}/get`](id, params)
    if (isDebug && results)
      debug(
        `getFromStore.path: ${path}`,
        `getFromStore.id: ${id}`,
        'getFromStore.results:',
        results
      )
    return results
  }

  /**
   * Create method, which is a proxy to the create action
   * @async
   *
   * @param {String} path
   * @param {Object|Object[]} data
   * @param {Object} params
   * @return {Object}
   */
  async create(path, data, params = {}) {
    let results = await this.dispatch(`${path}/create`, [data, params])
    if (isDebug && results)
      debug(
        `create.path: ${path}`,
        `create.data: ${data}`,
        'create.results:',
        results
      )
    return results
  }

  /**
   * Patch method, which is a proxy to the patch action
   * @async
   *
   * @param {String} path
   * @param {String} id
   * @param {Object} data
   * @param {Object} params
   * @return {Object}
   */
  async patch(path, id, data, params = {}) {
    let results = await this.dispatch(`${path}/patch`, [id, data, params])
    if (isDebug && results)
      debug(
        `patch.path: ${path}`,
        `patch.id: ${id}`,
        `patch.data: ${data}`,
        'patch.results:',
        results
      )
    return results
  }

  /**
   * Remove method, which is a proxy to the remove action
   * @async
   *
   * @param {String} path
   * @param {String} id
   * @return {Object}
   */
  async remove(path, id) {
    let results = await this.dispatch(`${path}/remove`, id)
    if (isDebug && results)
      debug(
        `remove.path: ${path}`,
        `remove.id: ${id}`,
        'remove.results:',
        results
      )
    return results
  }
}

export default Service
