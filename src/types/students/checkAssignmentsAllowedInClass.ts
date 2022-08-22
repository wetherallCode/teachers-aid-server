import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const CheckAssignmentsAllowedInClassInput = inputObjectType({
  name: 'CheckAssignmentsAllowedInClassInput',
  definition(t) {
    t.id('courseId', { required: true })
  },
})

export const CheckAssignmentsAllowedInClassPayload = objectType({
  name: 'CheckAssignmentsAllowedInClassPayload',
  definition(t) {
    // t.field('', { type:  })
    t.boolean('allowed')
  },
})

export const CheckAssignmentsAllowedInClass = queryField(
  'checkAssignmentsAllowedInClass',
  {
    type: CheckAssignmentsAllowedInClassPayload,
    args: {
      input: arg({ type: CheckAssignmentsAllowedInClassInput, required: true }),
    },
    async resolve(_, { input: { courseId } }, { courseData }) {
      const courseToFind: NexusGenRootTypes['CourseInfo'] =
        await courseData.findOne({
          'course._id': new ObjectId(courseId),
        })
      return { allowed: courseToFind.assignmentsAllowedInClass ? true : false }
    },
  }
)
