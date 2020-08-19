import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { User } from '.'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'

export const FindAllUsersPayload = objectType({
  name: 'FindAllUsersPayload',
  definition(t) {
    t.list.field('users', { type: User })
  },
})

export const FindAllUsers = queryField('findAllUsers', {
  type: FindAllUsersPayload,

  async resolve(_, __, { userData }) {
    const users: NexusGenRootTypes['User'][] = await userData.find().toArray()
    return { users }
  },
})
