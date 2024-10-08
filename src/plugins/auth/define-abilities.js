/* eslint-disable no-unused-vars */
import { defineAbility } from '@casl/ability'

export function defineAbilitiesFor(user) {
  return defineAbility((can, cannot) => {
    if (user.roleAlias === 'isAdministrator') {
      // Administrator can do all
      can('manage', 'all')
    }

    if (user.roleAlias !== 'isAdministrator') {
      // Can 'users' actions
      can('create', 'users')
      can('read', 'users')
      can(
        'update',
        'users',
        ['active', 'email', 'password', 'firstName', 'lastName', 'avatar'],
        { id: user.id }
      )
      // can('delete', 'users', {id: user.id});

      // Can 'user-profiles' actions
      can('create', 'user-profiles')
      can('read', 'user-profiles')
      can('update', 'user-profiles', { id: user.profileId })

      // Can 'roles' actions
      can('read', 'roles')

      // Can 'teams' actions
      can('read', 'teams')

      // Can 'user-teams' actions
      can('read', 'user-teams')

      // Can 'log-messages' actions
      can('read', 'log-messages')

      // Can 'chat-messages' actions
      can('create', 'chat-messages')
      can('read', 'chat-messages')
      can('update', 'chat-messages', ['msg'], { ownerId: user.id })
      can('remove', 'chat-messages', { ownerId: user.id })

      // Can 'opcua-tags' actions
      can('read', 'opcua-tags')
      // can('manage', 'opcua-tags');
      // can('create', 'opcua-tags');
      // can('read', 'opcua-tags');
      // can('update', 'opcua-tags');
      // can('remove', 'opcua-tags');

      // Can 'opcua-values' actions
      can('read', 'opcua-values')
      // can('manage', 'opcua-values');
      // can('create', 'opcua-values');
      // can('read', 'opcua-values');
      // can('update', 'opcua-values');
      // can('remove', 'opcua-values');

      // Can 'messages' actions
      can('create', 'messages')
      can('read', 'messages')
      can('update', 'messages', ['text'], { userId: user.id })
      can('remove', 'messages', { userId: user.id })
    }
  })
}
