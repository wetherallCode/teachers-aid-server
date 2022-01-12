import {
  objectType,
  inputObjectType,
  arg,
  mutationField,
  queryField,
} from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { Essay } from '.'

export const FindEssaysByStudentIdInput = inputObjectType({
  name: 'FindEssaysByStudentIdInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const FindEssaysByStudentIdPayload = objectType({
  name: 'FindEssaysByStudentIdPayload',
  definition(t) {
    t.list.field('essays', { type: Essay })
  },
})

export const FindEssaysByStudentId = queryField('findEssaysByStudentId', {
  type: FindEssaysByStudentIdPayload,
  args: { input: arg({ type: FindEssaysByStudentIdInput, required: true }) },
  async resolve(_, { input: { studentId } }, { assignmentData }) {
    const essays = await assignmentData
      .find({
        'hasOwner._id': new ObjectId(studentId),
        workingDraft: { $exists: true },
      })
      .toArray()
    return { essays }
  },
})
