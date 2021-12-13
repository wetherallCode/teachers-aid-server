import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const ToggleClassAssignmentsAllowedInput = inputObjectType({
  name: 'ToggleClassAssignmentsAllowedInput',
  definition(t) {
    t.id('courseId', { required: true })
  },
})

export const ToggleClassAssignmentsAllowedPayload = objectType({
  name: 'ToggleClassAssignmentsAllowedPayload',
  definition(t) {
    t.boolean('toggled')
  },
})

export const ToggleClassAssignmentsAllowed = mutationField(
  'toggleClassAssignmentsAllowed',
  {
    type: ToggleClassAssignmentsAllowedPayload,
    args: {
      input: arg({ type: ToggleClassAssignmentsAllowedInput, required: true }),
    },
    async resolve(_, { input: { courseId } }, { courseData }) {
      const courseInfoValidation: NexusGenRootTypes['CourseInfo'] =
        await courseData.findOne({
          'course._id': new ObjectId(courseId),
          startsAt: { $exists: true },
        })

      if (courseInfoValidation) {
        const { modifiedCount } = await courseData.updateOne(
          {
            'course._id': new ObjectId(courseId),
            startsAt: { $exists: true },
          },
          {
            $set: {
              assignmentsInClassNotAllowed:
                !courseInfoValidation.assignmentsInClassNotAllowed,
            },
          }
        )
        return { toggled: modifiedCount === 1 ? true : false }
      } else throw new Error('Course Information does not exist')
    },
  }
)
