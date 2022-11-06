import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { EssentialQuestion } from '.'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const FindEssentialQuestionsByAssociatedTextSectionIdsInput =
  inputObjectType({
    name: 'FindEssentialQuestionsByAssociatedTextSectionIdsInput',
    definition(t) {
      t.list.id('textSectionIds', { required: true })
    },
  })

export const FindEssentialQuestionsByAssociatedTextSectionIdsPayload =
  objectType({
    name: 'FindEssentialQuestionsByAssociatedTextSectionIdsPayload',
    definition(t) {
      t.list.field('essentialQuestions', { type: EssentialQuestion })
    },
  })

export const FindEssentialQuestionsByAssociatedTextSectionIds = queryField(
  'findEssentialQuestionsByAssociatedTextSectionIds',
  {
    type: FindEssentialQuestionsByAssociatedTextSectionIdsPayload,
    args: {
      input: arg({
        type: FindEssentialQuestionsByAssociatedTextSectionIdsInput,
        required: true,
      }),
    },
    async resolve(_, { input: { textSectionIds } }, { questionData }) {
      let essentialQuestions: NexusGenRootTypes['EssentialQuestion'][] = []

      for (const id of textSectionIds) {
        const eqs = await questionData
          .find({
            associatedTextSectionsIds: id,
            questionUsageType: 'ESSENTIAL_QUESTION',
          })
          .toArray()

        for (const question of eqs) {
          let container: NexusGenRootTypes['EssentialQuestion'][] = []

          if (container.some((q) => q._id !== question._id)) {
          } else {
            container.push(question)
            essentialQuestions.push(question)
          }
        }
      }

      // const reducedEssentialQuestions = essentialQuestions.reduce(
      //   (acc: NexusGenRootTypes['EssentialQuestion'][], i) => {
      //     return acc.some((q) => q._id === i._id) ? [...acc] : [...acc, i]
      //   },
      //   []
      // )

      return { essentialQuestions }
    },
  }
)
