import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { SpecialAssignment, TimeOfDayEnum } from '..'
import { MarkingPeriodEnum } from '../../general'

export const CreateSpecialAssignmentInput = inputObjectType({
  name: 'CreateSpecialAssignmentInput',
  definition(t) {
    t.list.id('assignedCourseIds', { required: true })
    t.string('hasAssignerId', { required: true })
    t.int('maxPoints', { required: true })
    t.field('readings', { type: 'ReadingsInput', required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.string('dueDate', { required: true })
    t.field('dueTime', { type: TimeOfDayEnum, required: true })
    t.string('assignedDate', { required: true })
  },
})

export const CreateSpecialAssignmentPayload = objectType({
  name: 'CreateSpecialAssignmentPayload',
  definition(t) {
    t.list.field('specialAssignments', { type: SpecialAssignment })
  },
})

export const CreateSpecialAssignment = mutationField(
  'createSpecialAssignment',
  {
    type: CreateSpecialAssignmentPayload,
    args: {
      input: arg({ type: CreateSpecialAssignmentInput, required: true }),
    },
    async resolve(
      _,
      {
        input: {
          assignedCourseIds,
          hasAssignerId,
          maxPoints,
          readings,
          markingPeriod,
          dueDate,
          dueTime,
          assignedDate,
        },
      },
      { assignmentData }
    ) {
      assignedCourseIds
      hasAssignerId
      maxPoints
      readings
      markingPeriod
      dueDate
      dueTime
      assignedDate
      assignmentData

      return { SpecialAssignment: [] }
    },
  }
)
