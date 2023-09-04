import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { Protocol } from '.'

export const FindActiveProtocolsByCourseInput = inputObjectType({
  name: 'FindActiveProtocolsByCourseInput',
  definition(t) {
    t.id('courseId', { required: true })
  },
})

export const FindActiveProtocolsByCoursePayload = objectType({
  name: 'FindActiveProtocolsByCoursePayload',
  definition(t) {
    t.list.field('protocols', { type: Protocol })
  },
})

export const FindActiveProtocolsByCourse = queryField(
  'findActiveProtocolsByCourse',
  {
    type: FindActiveProtocolsByCoursePayload,
    args: {
      input: arg({ type: FindActiveProtocolsByCourseInput, required: true }),
    },
    async resolve(_, { input: { courseId } }, { protocolData }) {
      const protocols = await protocolData
        .find({
          'student.inCourses._id': new ObjectId(courseId),
          isActive: true,
          assignedDate: new Date().toLocaleDateString(),
        })
        .toArray()
      return { protocols }
    },
  }
)
