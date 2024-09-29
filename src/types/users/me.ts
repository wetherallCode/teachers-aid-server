import { queryField } from '@nexus/schema'
import { User } from '.'
import { ObjectID } from 'mongodb'

export const Me = queryField('me', {
  type: User,
  nullable: true,
  async resolve(_, __, { req, userData }) {
    if (!req.session.userId) return null

    return await userData.findOne({
      _id: new ObjectID(req.session.userId),
    })
  },
})
