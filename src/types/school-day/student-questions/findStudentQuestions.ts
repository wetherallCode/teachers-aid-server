import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { StudentQuestion } from '.'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

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
    const studentQuestionContainer: NexusGenRootTypes['StudentQuestions'] = await schoolDayData.findOne(
      { 'course._id': new ObjectId(courseId), date }
    )

    if (studentQuestionContainer) {
      const studentQuestions = studentQuestionContainer.questions
      return { studentQuestions }
    } else throw new Error('No Question Container exists.')
  },
})
