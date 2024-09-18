import colors from 'vuetify/lib/util/colors'
import themeColorOptions from '@/api/app/theme-color-options.json'
import util from '@/plugins/lib/util'

const getters = {
  getConfig: state => {
    return state.config
  },

  getSnackBar: state => {
    return state.snackbar
  },

  getTheme: state => {
    return state.theme
  },

  getNotices: state => {
    return state.notices
  },

  getChat: state => {
    return state.chat
  },

  getSystem: state => {
    return state.system
  },

  getLoading: state => {
    return state.system.loading
  },

  getDbNullIdValue: state => {
    let result = null
    if (state.config.typeDB === 'mongodb')
      result = state.config.mongodbNullIdValue
    return result
  },

  getPrimaryColor: state => {
    const theme = state.theme
    // Get primary color
    const optColor = themeColorOptions.find(
      option => option.key === theme.primary
    )
    let subColor = optColor ? optColor.value[theme.name] : ''
    subColor = subColor.replace('-', '')
    const primaryColor = subColor
      ? colors[theme.primary][subColor]
      : colors[theme.primary]['base']
    return primaryColor
  },

  getPrimaryBaseColor: state => {
    const theme = state.theme
    // Get primary base color
    const primaryColor = colors[theme.primary].base
    return primaryColor
  },

  getFullPath: state => path => {
    const _path = util.stripSlashes(path)
    const fullPath =
      state.config.locale === state.config.fallbackLocale
        ? `/${_path}`
        : `/${state.config.locale}/${_path}`
    return fullPath
  },

  isAuth: state => {
    return !!state.auth.accessToken
  },

  isYouAuth: state => userId => {
    const idField = state.users.idField
    const user = state.auth.user
    const myUserId = user ? user[idField] : ''
    return userId === myUserId
  },

  isAdmin(state, getters) {
    return getters.isMyRole('isAdministrator')
  },

  isMyRole: (state, getters) => (isRole = '') => {
    return getters.getMyRole === getters.getRoles(isRole)
  },

  getMyRole: (state, getters) => {
    let roleAlias = ''
    let roleName = ''
    if (getters.isAuth) {
      roleAlias = getters.getUser.roleAlias
      roleName = getters.getRoles(roleAlias)
    }
    return roleName
  },

  /**
   * Get roles
   * e.g. { isAdministrator: 'Administrator', isGuest: 'Guest', isSuperRole: 'superRole' }
   * @param state
   * @param isRole
   * @return {Object}
   */
  getRoles: state => (isRole = '') => {
    const _roles = {}
    state.config.roles.forEach(role => {
      Object.assign(_roles, role)
    })
    return isRole ? _roles[isRole] : _roles
  },

  /**
   * Get base roles
   * e.g. { isAdministrator: 'Administrator', isGuest: 'Guest' }
   * @param state
   * @param isBaseRole
   * @return {Object}
   */
  getBaseRoles: state => (isBaseRole = '') => {
    const _roles = {}
    state.config.baseRoles.forEach(role => {
      Object.assign(_roles, role)
    })
    return isBaseRole ? _roles[isBaseRole] : _roles
  },

  isEnvRole: (state, getters) => (roleName = '') => {
    const names = Object.values(getters.getRoles())
    const result = names.indexOf(roleName) >= 0
    return result
  },

  isBaseRole: (state, getters) => (roleName = '') => {
    const names = Object.values(getters.getBaseRoles())
    const result = names.indexOf(roleName) >= 0
    return result
  },

  getUser: state => {
    return state.auth.user
  },

  getTeamIdsForUser: (state, getters) => userId => {
    const _teamsForUser = getters['user-teams/find']({ query: { userId: userId } }).data // ['user-teams/find']
    return _teamsForUser && _teamsForUser.lenth
      ? _teamsForUser.map(row => row.teamId.toString())
      : []
  },

  getUserIdsForTeam: (state, getters) => teamId => {
    const _usersForTeam = getters['user-teams/find']({
      query: { teamId: teamId, $sort: { userId: 1 } }
    }).data
    return _usersForTeam.map(row => row.userId.toString())
  },

  isMyTeam: (state, getters) => (userId, teamId) => {
    const teamIds = getters.getTeamIdsForUser(userId)
    const findIndex = teamIds.findIndex(id => id === teamId)
    return findIndex > -1
  },

  isExternalAccount: state => {
    const found = state.config.externalAccounts.find(function (account) {
      const accountId = `${account}Id`
      return state.auth.user && state.auth.user[accountId]
        ? !!state.auth.user[accountId]
        : false
    })
    return !!found
  },

  isUserExternalAccount: state => user => {
    const found = state.config.externalAccounts.find(function (account) {
      const accountId = `${account}Id`
      return user && user[accountId] ? !!user[accountId] : false
    })
    return !!found
  },

  //--- ECHARTS ---//
  getDemoRadarData({ echarts }) {
    return echarts.demoRadarData
  }
}

export default getters
