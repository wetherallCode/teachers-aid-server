import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { EssayQuestion } from '../questions'

export const FindEssayQuestionsForLessonInput = inputObjectType({
  name: 'FindEssayQuestionsForLessonInput',
  definition(t) {
    t.list.id('sectionIds', { required: true })
  },
})

export const FindEssayQuestionsForLessonPayload = objectType({
  name: 'FindEssayQuestionsForLessonPayload',
  definition(t) {
    t.list.field('essayQuestions', { type: EssayQuestion })
  },
})

export const FindEssayQuestionsForLesson = queryField(
  'findEssayQuestionsForLesson',
  {
    type: FindEssayQuestionsForLessonPayload,
    args: {
      input: arg({ type: FindEssayQuestionsForLessonInput, required: true }),
    },
    async resolve(_, { input: { sectionIds } }, { questionData }) {
      const questions = await questionData
        .find({
          questionUsageType: 'ESSAY',
          associatedTextSectionsIds: { $in: sectionIds },
        })
        .toArray()
      return { essayQuestions: questions }
    },
  }
)
