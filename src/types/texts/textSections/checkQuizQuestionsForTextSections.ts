import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const CheckQuizQuestionsForTextSectionsInput = inputObjectType({
  name: 'CheckQuizQuestionsForTextSectionsInput',
  definition(t) {
    t.list.string('textSectionIds', { required: true })
  },
})

export const CheckQuizQuestionsForTextSectionsPayload = objectType({
  name: 'CheckQuizQuestionsForTextSectionsPayload',
  definition(t) {
    t.list.string('textSectionIds')
  },
})

export const CheckQuizQuestionsForTextSections = queryField(
  'checkQuizQuestionsForTextSections',
  {
    type: CheckQuizQuestionsForTextSectionsPayload,
    args: {
      input: arg({
        type: CheckQuizQuestionsForTextSectionsInput,
        required: true,
      }),
    },
    async resolve(_, { input: { textSectionIds } }, { questionData }) {
      let textSectionIdList: string[] = []
      for (const id of textSectionIds) {
        const textSection: NexusGenRootTypes['TextSection'] =
          await questionData.findOne({
            questionUsageType: 'QUIZ',
            associatedTextSectionId: id,
          })
        if (textSection) textSectionIdList.push(textSection._id!)
      }
      return { textSectionIds: textSectionIdList }
    },
  }
)
