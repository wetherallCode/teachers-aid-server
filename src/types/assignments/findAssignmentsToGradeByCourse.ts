import { inputObjectType, objectType, arg, queryField } from '@nexus/schema'
import { Assignment } from '.'

export const FindAssignmentsToGradeByCourseInput = inputObjectType({
  name: 'FindAssignmentsToGradeInput',
  definition(t) {
    t.string('teacherUserName', { required: true })
    t.string('courseName', { required: true })
  },
})

export const FindAssignmentsToGradeByCoursePayload = objectType({
  name: 'FindAssignmentsToGradePayload',
  definition(t) {
    t.list.field('assignments', { type: Assignment })
  },
})

export const FindAssignmentsToGradeByCourse = queryField(
  'findAssignmentsToGradeByCourse',
  {
    type: FindAssignmentsToGradeByCoursePayload,
    args: {
      input: arg({ type: FindAssignmentsToGradeByCourseInput, required: true }),
    },
    async resolve(
      _,
      { input: { teacherUserName, courseName } },
      { assignmentData }
    ) {
      const assignments = await assignmentData
        .find({ hasTeacher: teacherUserName, courseName })
        .toArray()

      return { assignments }
    },
  }
)
