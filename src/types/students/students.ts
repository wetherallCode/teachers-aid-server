import { objectType } from '@nexus/schema'
import { User } from '../users'
import { Course } from '..'

export const Student = objectType({
  name: 'Student',
  definition(t) {
    t.implements(User)
    t.list.field('hasAssignments', {
      type: 'Assignment',
      async resolve(parent, __, { assignmentData }) {
        const assignments = await assignmentData
          .find({ 'hasOwner.userName': parent.userName })
          .toArray()

        return assignments
      },
    })
    t.list.field('inCourses', { type: Course })
  },
})
