import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { iff, discard } from 'feathers-hooks-common'
import feathersVuex from 'feathers-vuex'

const isDebug = true

// Get target URL
const envTargetURL = process.env.TARGET_URL
if (isDebug) console.log('TARGET_URL', envTargetURL)

const targetURL = envTargetURL ? envTargetURL : 'http://localhost:3030'
const socket = io(targetURL, { transports: ['websocket'] })
if (isDebug && socket) console.log('Socket connect to:', targetURL)

const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }))
  .hooks({
    before: {
      all: [
        iff(
          context => ['create', 'update', 'patch'].includes(context.method),
          discard('__id', '__isTemp')
        )
      ]
    }
  })

export default feathersClient

// Setting up feathers-vuex
const {
  makeServicePlugin,
  makeAuthPlugin,
  BaseModel,
  models,
  FeathersVuex
} = feathersVuex(feathersClient, {
  serverAlias: 'api', // optional for working with multiple APIs (this is the default value)
  idField: '_id', // Must match the id field in your database table/collection
  whitelist: ['$regex', '$options']
})

export { makeAuthPlugin, makeServicePlugin, BaseModel, models, FeathersVuex }
