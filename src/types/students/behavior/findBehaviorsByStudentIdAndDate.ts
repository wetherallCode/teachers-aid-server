import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { StudentBehavior } from './studentBehavior'

export const FindBehaviorsByStudentIdAndDateInput = inputObjectType({
  name: 'FindBehaviorsByStudentIdAndDateInput',
  definition(t) {
    t.id('studentId', { required: true })
    t.string('date', { required: true })
  },
})

export const FindBehaviorsByStudentIdAndDatePayload = objectType({
  name: 'FindBehaviorsByStudentIdAndDatePayload',
  definition(t) {
    t.list.field('behaviors', { type: StudentBehavior })
  },
})

export const FindBehaviorsByStudentIdAndDate = queryField(
  'findBehaviorsByStudentIdAndDate',
  {
    type: FindBehaviorsByStudentIdAndDatePayload,
    args: {
      input: arg({
        type: FindBehaviorsByStudentIdAndDateInput,
        required: true,
      }),
    },
    async resolve(_, { input: { studentId, date } }, { studentData }) {
      const behaviors = await studentData
        .find({
          'student._id': new ObjectId(studentId),
          date,
          behavior: { $exists: true },
        })
        .toArray()

      return { behaviors }
    },
  }
)
