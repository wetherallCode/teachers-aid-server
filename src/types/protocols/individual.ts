import { Student } from '../students'
import { objectType } from '@nexus/schema'

export const Individual = objectType({
  name: 'Individual',
  definition(t) {
    t.implements('Protocol')
    t.field('student', { type: Student })
  },
})
