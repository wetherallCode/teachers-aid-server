import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { StudentForTeachersAid } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const FindStudentByIdForTeachersAidInput = inputObjectType({
  name: 'FindStudentByIdForTeachersAidInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const FindStudentByIdForTeachersAidPayload = objectType({
  name: 'FindStudentByIdForTeachersAidPayload',
  definition(t) {
    t.field('student', { type: StudentForTeachersAid })
  },
})

export const FindStudentByIdForTeachersAid = queryField(
  'findStudentByIdForTeachersAid',
  {
    type: FindStudentByIdForTeachersAidPayload,
    args: {
      input: arg({ type: FindStudentByIdForTeachersAidInput, required: true }),
    },
    async resolve(_, { input: { studentId } }, { userData }) {
      const student: NexusGenRootTypes['Student'] = await userData.findOne({
        _id: new ObjectId(studentId),
        inCourses: { $exists: true },
      })

      return { student }
    },
  }
)
