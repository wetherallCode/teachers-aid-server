import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { EssayQuestion } from '.'
import { QuestionPartsContainerInput } from '../../assignments'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'
import { QuestionTypeEnum } from '../../texts/textSections'

export const CreateEssayQuestionInput = inputObjectType({
  name: 'CreateEssayQuestionInput',
  definition(t) {
    t.field('questionPartsInput', {
      type: QuestionPartsContainerInput,
      required: true,
    })
    t.list.string('associatedTextSectionsIds', { required: true })
  },
})

export const CreateEssayQuestionPayload = objectType({
  name: 'CreateEssayQuestionPayload',
  definition(t) {
    t.field('essayQuestion', { type: EssayQuestion })
  },
})

export const CreateEssayQuestion = mutationField('createEssayQuestion', {
  type: CreateEssayQuestionPayload,
  args: { input: arg({ type: CreateEssayQuestionInput, required: true }) },
  async resolve(
    _,
    { input: { questionPartsInput, associatedTextSectionsIds } },
    { questionData }
  ) {
    const essayQuestion: NexusGenRootTypes['EssayQuestion'] = {
      associatedTextSectionsIds,
      questionParts: questionPartsInput,
      questionUsageType: 'ESSAY',
    }
    const { insertedId } = await questionData.insertOne(essayQuestion)
    essayQuestion._id = insertedId

    return { essayQuestion }
  },
})
