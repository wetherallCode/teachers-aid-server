import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectID } from 'bson'
import { Assignment } from '.'

export const FindAssignmentsByCourseIdInput = inputObjectType({
  name: 'FindAssignmentsByCourseIdInput',
  definition(t) {
    t.id('courseId', { required: true })
  },
})

export const FindAssignmentsByCourseIdPayload = objectType({
  name: 'FindAssignmentsByCourseIdPayload',
  definition(t) {
    t.list.field('assignments', { type: Assignment })
  },
})

export const FindAssignmentsByCourseId = queryField(
  'findAssignmentsByCourseId',
  {
    type: FindAssignmentsByCourseIdPayload,
    args: {
      input: arg({ type: FindAssignmentsByCourseIdInput, required: true }),
    },
    async resolve(_, { input: { courseId } }, { assignmentData }) {
      const assignments = await assignmentData
        .find({ 'hasOwner.inCourses._id': new ObjectID(courseId) })
        .toArray()
      console.log(assignments.length)
      return { assignments }
    },
  }
)
