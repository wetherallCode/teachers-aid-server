import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { EssentialQuestion } from '.'
import { QuestionPartsContainerInput } from '../..'

export const CreateEssentialQuestionInput = inputObjectType({
  name: 'CreateEssentialQuestionInput',
  definition(t) {
    t.list.string('associatedTextSectionsIds', { required: true })
    t.string('question', { required: true })
  },
})

export const CreateEssentialQuestionPayload = objectType({
  name: 'CreateEssentialQuestionPayload',
  definition(t) {
    t.field('essentialQuestion', { type: EssentialQuestion })
  },
})

export const CreateEssentialQuestion = mutationField(
  'createEssentialQuestion',
  {
    type: CreateEssentialQuestionPayload,
    args: {
      input: arg({ type: CreateEssentialQuestionInput, required: true }),
    },
    async resolve(
      _,
      { input: { associatedTextSectionsIds, question } },
      { questionData }
    ) {
      // const essentialQuestionCheck = await questionData.findOne({question})
      // for (const section of associatedTextSectionsIds) {
      //   const objectToFind = await db.findOne({})
      // }
      const essentialQuestion: NexusGenRootTypes['EssentialQuestion'] = {
        associatedTextSectionsIds,
        question,
        questionUsageType: 'ESSENTIAL_QUESTION',
      }
      const { insertedId } = await questionData.insertOne(essentialQuestion)
      essentialQuestion._id = insertedId

      return { essentialQuestion }
    },
  }
)
