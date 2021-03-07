import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { TemporaryTask } from '.'

export const FindTemporaryTasksByStudentIdInput = inputObjectType({
  name: 'FindTemporaryTasksByStudentIdInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const FindTemporaryTasksByStudentIdPayload = objectType({
  name: 'FindTemporaryTasksByStudentIdPayload',
  definition(t) {
    t.list.field('temporaryTasks', { type: TemporaryTask })
  },
})

export const FindTemporaryTasksByStudentId = queryField(
  'findTemporaryTasksByStudentId',
  {
    type: FindTemporaryTasksByStudentIdPayload,
    args: {
      input: arg({ type: FindTemporaryTasksByStudentIdInput, required: true }),
    },
    async resolve(_, { input: { studentId } }, { temporaryTaskData }) {
      const temporaryTasks = await temporaryTaskData
        .find({ 'student._id': new ObjectId(studentId) })
        .toArray()
      return { temporaryTasks }
    },
  }
)
