import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const ToggleAssignmentsAllowedInClassInput = inputObjectType({
  name: 'ToggleAssignmentsAllowedInClassInput',
  definition(t) {
    t.id('courseId', { required: true })
  },
})

export const ToggleAssignmentsAllowedInClassPayload = objectType({
  name: 'ToggleAssignmentsAllowedInClassPayload',
  definition(t) {
    // t.field('', { type:  })
    t.boolean('toggled')
  },
})

export const ToggleAssignmentsAllowedInClass = mutationField(
  'toggleAssignmentsAllowedInClass',
  {
    type: ToggleAssignmentsAllowedInClassPayload,
    args: {
      input: arg({
        type: ToggleAssignmentsAllowedInClassInput,
        required: true,
      }),
    },
    async resolve(_, { input: { courseId } }, { courseData }) {
      const courseToFind: NexusGenRootTypes['CourseInfo'] =
        await courseData.findOne({
          'course._id': new ObjectId(courseId),
        })
      const { modifiedCount } = await courseData.updateOne(
        { 'course._id': new ObjectId(courseId) },
        {
          $set: {
            assignmentsAllowedInClass: !courseToFind.assignmentsAllowedInClass,
          },
        }
      )
      const course: NexusGenRootTypes['CourseInfo'] = await courseData.findOne({
        'course._id': new ObjectId(courseId),
      })
      return { toggled: modifiedCount === 1 ? true : false }
    },
  }
)
