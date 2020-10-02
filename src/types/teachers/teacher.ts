import { objectType, enumType } from '@nexus/schema'
import { User } from '../users/users'
import { Course } from '..'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const Teacher = objectType({
  name: 'Teacher',
  definition(t) {
    t.implements(User)
    t.field('title', { type: TitleEnum })
    t.list.field('teachesCourses', {
      type: Course,
    })
    t.list.field('hasParentContacts', {
      type: 'ParentContact',
      async resolve(parent, __, { teacherData }) {
        const parentContacts: NexusGenRootTypes['ParentContact'][] = await teacherData
          .find({ teacherId: parent._id })
          .toArray()
        return parentContacts
      },
    })
  },
})

export const TitleEnum = enumType({
  name: 'TitleEnum',
  members: ['MR', 'MRS', 'MS', 'MISS'],
})
