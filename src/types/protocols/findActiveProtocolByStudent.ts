import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { Protocol } from '.'

export const FindActiveProtocolByStudentInput = inputObjectType({
  name: 'FindActiveProtocolByStudentInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const FindActiveProtocolByStudentPayload = objectType({
  name: 'FindActiveProtocolByStudentPayload',
  definition(t) {
    t.field('protocol', { type: Protocol })
  },
})

export const FindActiveProtocolByStudent = queryField(
  'findActiveProtocolByStudent',
  {
    type: FindActiveProtocolByStudentPayload,
    args: {
      input: arg({ type: FindActiveProtocolByStudentInput, required: true }),
    },
    async resolve(_, { input: { studentId } }, { protocolData }) {
      const protocol = await protocolData.findOne({
        'student._id': new ObjectId(studentId),
        isActive: true,
        assignedDate: new Date().toLocaleDateString(),
      })
      return { protocol }
    },
  }
)
