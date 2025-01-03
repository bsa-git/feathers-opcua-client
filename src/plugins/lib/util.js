/* eslint-disable no-unused-vars */
import cookies from 'browser-cookies'
import goTo from 'vuetify/es5/services/goto'

import loCloneDeep from 'lodash/cloneDeep'

const debug = require('debug')('app:plugins.util')
const isDebug = true

/**
 * Delay time
 * @param sec
 * @return {Promise}
 */
const delayTime = function(sec = 1) {
  return new Promise(function(resolve) {
    setTimeout(() => {
      if (isDebug) debug(`delayTime: ${sec * 1000} MSec`)
      resolve('done!')
    }, sec * 1000)
  })
}

/**
 * Pause
 * @param ms
 * @return {Promise}
 */
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Awaiting positive completion of a function
 * @param fn
 * @param cb
 * @param delay
 */
const waitTimeout = function(fn, cb = null, delay = 0) {
  let _delay = delay ? delay : 1000
  let timerId = setTimeout(function request() {
    let result = fn()
    if (!result) {
      timerId = setTimeout(request, _delay)
    } else {
      if (cb) cb()
      clearInterval(timerId)
    }
  }, _delay)
}

/**
 * Go To Scroll
 * Programmatic Scrolling
 * @param to {string | number | HTMLElement | VueComponent}
 * @param params {Object}
 */
const goToScroll = function(to, params = {}) {
  let _params = {
    duration: 500,
    offset: 0,
    easing: 'easeInOutCubic'
  }
  goTo(to, Object.assign(_params, params))
}

/**
 * Strip slashes
 * @param value String
 * @return {string|*|void}
 */
const stripSlashes = function(value) {
  const _value = value ? value.replace(/^(\/*)|(\/*)$/g, '') : value
  return _value
}

/**
 * Strip slashes
 * @param value String
 * @param symbol String
 * @return {string|*|void}
 */
const stripSpecific = function(value = '', symbol = '') {
  const regEx = new RegExp('^[' + symbol + ']+|[' + symbol + ']+$', 'g')
  const trimValue = symbol ? value.replace(regEx, '') : value.trim()
  return trimValue
}

/**
 * Get capitalize string
 * @param value
 * @param prefix
 */
const getCapitalizeStr = function(value, prefix = '') {
  const loCapitalize = require('lodash/capitalize')
  const loWords = require('lodash/words')
  let _value = loCapitalize(value)
  if (prefix) {
    let words = loWords(_value).map(word => loCapitalize(word))
    _value = words.join('')
    _value = prefix + _value
  }
  return _value
}

/**
 * Is true
 * @param value String|Any
 * @return boolean
 */
const isTrue = function(value) {
  if (typeof value === 'string') {
    value = value.trim().toLowerCase()
  }

  switch (value) {
    case true:
    case 'true':
    case 1:
    case '1':
    case 'on':
    case 'yes':
      return true
    default:
      return false
  }
}

/**
 * @method isClient
 * @returns {Boolean}
 */
const isClient = function() {
  return window !== 'undefined'
}

/**
 * Get number from value
 * @param value
 * @return {number}
 */
const getNumber = function(value) {
  return Number.isInteger(value) ? value : Number.parseInt(value)
}

/**
 * Get Regex
 * @param type
 * @return {String}
 */
const getRegex = function(type) {
  if (typeof type === 'string') {
    type = type.trim().toLowerCase()
  }
  switch (type) {
    case 'phone':
      /*
        (123) 456-7890
        +(123) 456-7890
        +(123)-456-7890
        +(123) - 456-7890
        +(123) - 456-78-90
        123-456-7890
        123.456.7890
        1234567890
        +31636363634
        +380980029669
        075-63546725
        */
      return '^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\\s\\./0-9]*$'
    case 'zip_code':
      /*
        12345
        12345-6789
        */
      return '^[0-9]{5}(?:-[0-9]{4})?$'
    case 'lat':
      /*
        +90.0
        45
        -90
        -90.000
        +90
        47.123123
        */
      return '^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$'
    case 'long':
      /*
        -127.554334
        180
        -180
        -180.0000
        +180
        179.999999
        */
      return '^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$'
    case 'lat_and_long':
      /*
        +90.0, -127.554334
        45, 180
        -90, -180
        -90.000, -180.0000
        +90, +180
        47.1231231, 179.99999999
        */
      return '^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?),\\s*[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$'
    default:
      return '//g'
  }
}

/**
 * getAccessToken
 * @returns {String|null}
 */
const getAccessToken = function() {
  if (isClient()) {
    return cookies.get('feathers-jwt')
  } else {
    return null
  }
}

/**
 * setAccessToken
 * @param token
 */
const setAccessToken = function(token) {
  if (isClient()) {
    setCookieWithAttributes('feathers-jwt', token)
  }
}

/**
 * isAccessToken
 * @returns {boolean}
 */
const isAccessToken = function() {
  return !!getAccessToken()
}

/**
 * removeAccessToken
 */
const removeAccessToken = function() {
  if (isClient()) {
    cookies.erase('feathers-jwt')
  }
}

/**
 * verifyJWT
 * Pass a jwt token, get back a payload if it's valid.
 *
 * @param token
 * @return {Promise.<void>}
 */
const verifyJWT = async function(token) {
  const decode = require('jwt-decode')
  //-----------------------------------
  const payloadIsValid = function payloadIsValid(payload) {
    return (
      payload && (!payload.exp || payload.exp * 1000 > new Date().getTime())
    )
  }

  if (typeof token !== 'string') {
    return Promise.reject(
      new Error('Token provided to verifyJWT is missing or not a string')
    )
  }

  try {
    let payload = decode(token)

    if (payloadIsValid(payload)) {
      return Promise.resolve(payload)
    }

    return Promise.reject(new Error('Invalid token: expired'))
  } catch (error) {
    return Promise.reject(new Error('Cannot decode malformed token.'))
  }
}

/**
 * readCookie
 * Reads and returns the contents of a cookie with the provided name for server.
 * @param cookies {String}
 * @param name {String}
 * @returns {String|undefined}
 */
function readCookie(cookies, name) {
  if (!cookies) {
    return undefined
  }
  let nameEQ = name + '='
  let ca = cookies.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length)
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length)
    }
  }
  return null
}

/**
 * Set cookie with attributes
 * Use the method of setting cookie attributes directly via document.cookie
 * @param name {String}
 * @param value {String}
 * @param options {Object}
 * e.g. options->{
 * - expires: The expiration date of the cookie (the Date object).
 * - path: The path that the cookie belongs to.
 * - domain: The domain that the cookie belongs to.
 * - sameSite: The value of the SameSite attribute ('Strict', 'Lux', 'None'). By default, 'Lax'.
 * - secure is a Boolean value that determines whether to specify the Secure attribute (for SameSite=None).
 * }
 */
function setCookieWithAttributes(name, value, options = {}) {
  let cookieString = `${name}=${value}`
  //----------------------------------------------------------
  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`
  } else {
    const now = new Date()
    const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // The cookie expires after 30 days
    cookieString += `; expires=${expires.toUTCString()}`
  }

  if (options.path) {
    cookieString += `; path=${options.path || '/'}`
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`
  }

  cookieString += `; SameSite=${options.sameSite || 'Lax'}`

  if (options.secure) {
    cookieString += '; Secure'
  }

  document.cookie = cookieString
}

/**
 * sort array by string field
 * @param items {Array}
 * @param name {String}
 * @param isAscending {Boolean}
 */
function sortByStringField(items, name, isAscending = true) {
  items.sort((x, y) => {
    let textA = x[name].toLocaleUpperCase()
    let textB = y[name].toLocaleUpperCase()
    if (isAscending) return textA < textB ? -1 : textA > textB ? 1 : 0
    if (!isAscending) return textA < textB ? 1 : textA > textB ? -1 : 0
  })
}

/**
 * sort array by number field
 * @param items {Array}
 * @param name {String}
 * @param isAscending {Boolean}
 */
function sortByNumberField(items, name, isAscending = true) {
  items.sort((x, y) => {
    if (isAscending) return x[name] - y[name]
    if (!isAscending) return y[name] - x[name]
  })
}

/**
 * sort array by string
 * @param items {Array}
 * @param isAscending {Boolean}
 */
function sortByString(items, isAscending = true) {
  items.sort((x, y) => {
    let textA = x.toLocaleUpperCase()
    let textB = y.toLocaleUpperCase()
    if (isAscending) return textA < textB ? -1 : textA > textB ? 1 : 0
    if (!isAscending) return textA < textB ? 1 : textA > textB ? -1 : 0
  })
}

/**
 * sort array by number field
 * @param items {Array}
 * @param isAscending {Boolean}
 */
function sortByNumber(items, isAscending = true) {
  items.sort((x, y) => {
    if (isAscending) return x - y
    if (!isAscending) return y - x
  })
}

/**
 * Query params
 * @param obj
 * @returns {string}
 */
const qlParams = function(obj) {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Expected object. (qlParams)')
  }

  return stringify(obj, undefined, undefined, '', '')
}

/**
 * Stringify to represent an object as a string
 * @param obj
 * @param spacer
 * @param separator
 * @param leader
 * @param trailer
 * @returns {string}
 */
const stringify = function(
  obj,
  spacer = ' ',
  separator = ', ',
  leader = '{',
  trailer = '}'
) {
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return JSON.stringify(obj)
  }

  const str = Object.keys(obj)
    .map(key => `${key}:${spacer}${stringify(obj[key], spacer, separator)}`)
    .join(', ')

  return `${leader}${str}${trailer}`
}

/**
 * Get context for log
 * @param context
 * @return {Object}
 */
const getHookContext = function(context) {
  let target = {}
  let { service, path, method, type, params, id, data, result, error } = context

  if (service) target.service = service
  if (service && service.FeathersVuexModel)
    target.Model = service.FeathersVuexModel
  if (path) target.path = path
  if (method) target.method = method
  if (type) target.type = type
  if (params) target.params = params
  if (id) target.id = id
  if (data && type === 'before') target.data = data
  if (result) target.result = result
  if (error) target.error = error
  return target
}

/**
 * The value to recursively clone
 * @method cloneObject
 * @param {Object?} obj - Object to clone
 * @returns {Object} Cloned object
 */
const cloneObject = function(obj) {
  return loCloneDeep(obj)
}

export default {
  delayTime,
  pause,
  waitTimeout,
  goToScroll,
  stripSlashes,
  stripSpecific,
  getCapitalizeStr,
  isTrue,
  isClient,
  getNumber,
  getRegex,
  getAccessToken,
  setAccessToken,
  isAccessToken,
  removeAccessToken,
  verifyJWT,
  readCookie,
  setCookieWithAttributes,
  sortByStringField,
  sortByNumberField,
  sortByString,
  sortByNumber,
  qlParams,
  stringify,
  getHookContext,
  cloneObject
}
