import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { Assignment } from '../assignments'
import { MarkingPeriodEnum } from '../general'
import { ResponsibilityPoints } from './responsibilityPoints'

export const FindAllMarkingPeriodGradesInput = inputObjectType({
  name: 'FindAllMarkingPeriodGradesInput',
  definition(t) {
    t.string('studentId', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
  },
})

export const FindAllMarkingPeriodGradesPayload = objectType({
  name: 'FindAllMarkingPeriodGradesPayload',
  definition(t) {
    t.field('responsibilityPoints', { type: ResponsibilityPoints })
    t.list.field('assignments', { type: Assignment })
  },
})

export const FindAllMarkingPeriodGrades = queryField(
  'findAllMarkingPeriodGrades',
  {
    type: FindAllMarkingPeriodGradesPayload,
    args: {
      input: arg({ type: FindAllMarkingPeriodGradesInput, required: true }),
    },
    async resolve(
      _,
      { input: { studentId, markingPeriod } },
      { studentData, assignmentData }
    ) {
      const assignments: NexusGenRootTypes['Assignment'][] =
        await assignmentData
          .find({ 'hasOwner._id': new ObjectId(studentId), markingPeriod })
          .toArray()

      const responsibilityPoints = await studentData.findOne({
        responsibilityPoints: {
          $exists: true,
        },
        markingPeriod,
        behavior: { $exists: false },
        'student._id': new ObjectId(studentId),
      })

      return { assignments, responsibilityPoints }
    },
  }
)
