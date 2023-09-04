import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Protocol } from '.'
import { ObjectId } from 'mongodb'

export const FindProtocolsByDateInput = inputObjectType({
  name: 'FindProtocolResponsesInput',
  definition(t) {
    t.string('date', { required: true })
    t.string('courseId', { required: true })
  },
})

export const FindProtocolsByDatePayload = objectType({
  name: 'FindProtocolResponsesPayload',
  definition(t) {
    t.list.field('protocols', { type: Protocol })
  },
})

export const FindProtocolsByDate = queryField('findProtocolsByDate', {
  type: FindProtocolsByDatePayload,
  args: { input: arg({ type: FindProtocolsByDateInput, required: true }) },
  async resolve(_, { input: { date, courseId } }, { protocolData }) {
    const protocols = await protocolData
      .find({
        assignedDate: date,
        'student.inCourses._id': new ObjectId(courseId),
      })
      .toArray()

    return { protocols }
  },
})
