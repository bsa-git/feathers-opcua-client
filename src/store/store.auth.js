import { makeAuthPlugin } from '@/plugins/auth/feathers-client'

export default makeAuthPlugin({ userService: 'users' })
