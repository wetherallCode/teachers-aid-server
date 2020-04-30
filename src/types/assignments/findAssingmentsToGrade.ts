import { inputObjectType, objectType, queryField, arg } from '@nexus/schema'
import { Assignment } from '.'

export const FindAssignmentsToGradeInput = inputObjectType({
  name: 'FindAssignmentsToGradeInput',
  definition(t) {
    t.string('teacherUserName', { required: true })
  },
})

export const FindAssignmentsToGradePayload = objectType({
  name: 'FindAssignmentsToGradePayload',
  definition(t) {
    t.list.field('assignments', { type: Assignment })
  },
})

export const FindAssignmentsToGrade = queryField('findAssignmentsToGrade', {
  type: FindAssignmentsToGradePayload,
  args: { input: arg({ type: FindAssignmentsToGradeInput, required: true }) },
  async resolve(_, { input: { teacherUserName } }, { assignmentData }) {
    const assignments = await assignmentData
      .find({
        'hasAssigner.userName': teacherUserName,
        'finalDraft.submitted': true,
      })
      .toArray()
    return { assignments: assignments }
  },
})
