import { objectType, enumType } from '@nexus/schema'
import { User } from '../users/users'
import { Course } from '..'

export const Teacher = objectType({
  name: 'Teacher',
  definition(t) {
    t.implements(User)
    t.field('title', { type: TitleEnum })
    t.list.field('teachesCourses', {
      type: Course,
    })
  },
})

export const TitleEnum = enumType({
  name: 'TitleEnum',
  members: ['MR', 'MRS', 'MS', 'MISS'],
})
