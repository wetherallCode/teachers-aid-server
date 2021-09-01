import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Essay } from '.'
import { ObjectId } from 'mongodb'

export const FindCompletedEssaysByStudentIdInput = inputObjectType({
  name: 'FindCompletedEssaysByStudentIdInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const FindCompletedEssaysByStudentIdPayload = objectType({
  name: 'FindCompletedEssaysByStudentIdPayload',
  definition(t) {
    t.list.field('essays', { type: Essay })
  },
})

export const FindCompletedEssaysByStudentId = queryField(
  'findCompletedEssaysByStudentId',
  {
    type: FindCompletedEssaysByStudentIdPayload,
    args: {
      input: arg({ type: FindCompletedEssaysByStudentIdInput, required: true }),
    },
    async resolve(_, { input: { studentId } }, { assignmentData }) {
      const essays = await assignmentData
        .find({
          'hasOwner._id': new ObjectId(studentId),
          finalDraft: { $exists: true },
        })
        .toArray()
      return { essays }
    },
  }
)
