import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ResponsibilityPoints } from '.'

export const FindResponsibilityPointsByStudentIdInput = inputObjectType({
  name: 'FindResponsibilityPointsByStudentIdInput',
  definition(t) {
    t.id('studentId', { required: true })
  },
})

export const FindResponsibilityPointsByStudentIdPayload = objectType({
  name: 'FindResponsibilityPointsByStudentIdPayload',
  definition(t) {
    t.list.field('responsibilityPoints', { type: ResponsibilityPoints })
  },
})

export const FindResponsibilityPointsByStudentId = queryField(
  'findResponsibilityPointsByStudentId',
  {
    type: FindResponsibilityPointsByStudentIdPayload,
    args: {
      input: arg({
        type: FindResponsibilityPointsByStudentIdInput,
        required: true,
      }),
    },
    async resolve(_, { input: { studentId } }, { studentData, userData }) {
      const studentCheck = await userData.findOne({
        _id: new ObjectId(studentId),
      })
      if (!studentCheck) {
        throw new Error('Student does not exist')
      }
      const responsibilityPoints = await studentData
        .find({
          'student._id': new ObjectId(studentId),
          responsibilityPoints: { $exists: true },
        })
        .toArray()
      if (responsibilityPoints) {
        return { responsibilityPoints }
      } else throw new Error('responsibilityPoints do not exist')
    },
  }
)
