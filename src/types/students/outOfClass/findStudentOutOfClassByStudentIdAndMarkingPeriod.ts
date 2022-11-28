import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { StudentOutOfClass } from './studentOutOfClass'

export const FindStudentOutOfClassByStudentIdAndMarkingPeriodInput =
  inputObjectType({
    name: 'FindStudentOutOfClassByStudentIdAndMarkingPeriodInput',
    definition(t) {
      t.id('studentId', { required: true })
      t.field('markingPeriod', { type: 'MarkingPeriodEnum', required: true })
    },
  })

export const FindStudentOutOfClassByStudentIdAndMarkingPeriodPayload =
  objectType({
    name: 'FindStudentOutOfClassByStudentIdAndMarkingPeriodPayload',
    definition(t) {
      t.list.field('studentOutOfClassListForMarkingPeriod', {
        type: StudentOutOfClass,
      })
    },
  })

export const FindStudentOutOfClassByStudentIdAndMarkingPeriod = queryField(
  'findStudentOutOfClassByStudentIdAndMarkingPeriod',
  {
    type: FindStudentOutOfClassByStudentIdAndMarkingPeriodPayload,
    args: {
      input: arg({
        type: FindStudentOutOfClassByStudentIdAndMarkingPeriodInput,
        required: true,
      }),
    },
    async resolve(_, { input: { studentId, markingPeriod } }, { studentData }) {
      const studentOutOfClassListForMarkingPeriod: NexusGenRootTypes['StudentOutOfClass'][] =
        await studentData
          .find({
            outOfClassDestination: { $exists: true },
            'student._id': new ObjectId(studentId),
            markingPeriod,
          })
          .toArray()
      return { studentOutOfClassListForMarkingPeriod }
    },
  }
)
