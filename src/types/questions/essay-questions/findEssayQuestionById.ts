import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { EssayQuestion } from '.'

export const FindEssayQuestionByIdInput = inputObjectType({
  name: 'FindEssayQuestionByIdInput',
  definition(t) {
    t.id('essayQuestionId', { required: true })
  },
})

export const FindEssayQuestionByIdPayload = objectType({
  name: 'FindEssayQuestionByIdPayload',
  definition(t) {
    t.field('essayQuestion', { type: EssayQuestion })
  },
})

export const FindEssayQuestionById = queryField('findEssayQuestionById', {
  type: FindEssayQuestionByIdPayload,
  args: { input: arg({ type: FindEssayQuestionByIdInput, required: true }) },
  async resolve(_, { input: { essayQuestionId } }, { questionData }) {
    const essayQuestion = await questionData.findOne({
      _id: new ObjectId(essayQuestionId),
    })
    return { essayQuestion }
  },
})
