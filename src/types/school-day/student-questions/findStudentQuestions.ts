import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { StudentQuestion } from '.'

export const FindStudentQuestionsInput = inputObjectType({
  name: 'FindStudentQuestionsInput',
  definition(t) {
    t.id('courseId', { required: true })
    t.string('date', { required: true })
  },
})

export const FindStudentQuestionsPayload = objectType({
  name: 'FindStudentQuestionsPayload',
  definition(t) {
    t.list.field('studentQuestions', { type: StudentQuestion })
  },
})

export const FindStudentQuestions = queryField('findStudentQuestions', {
  type: FindStudentQuestionsPayload,
  args: { input: arg({ type: FindStudentQuestionsInput, required: true }) },
  async resolve(_, { input: { courseId, date } }, { schoolDayData }) {
    const studentQuestions = await schoolDayData
      .find({ 'course._id': courseId, date })
      .toArray()

    return { studentQuestions }
  },
})
