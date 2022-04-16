import {
  objectType,
  inputObjectType,
  arg,
  mutationField,
  queryField,
} from '@nexus/schema'

export const MarkLessonForSGOInput = inputObjectType({
  name: 'MarkLessonForSGOInput',
  definition(t) {
    t.list.id('sectionIds', { required: true })
  },
})

export const MarkLessonForSGOPayload = objectType({
  name: 'MarkLessonForSGOPayload',
  definition(t) {
    t.boolean('marked')
  },
})

export const MarkLessonForSGO = mutationField('markLessonForSGO', {
  type: MarkLessonForSGOPayload,
  args: { input: arg({ type: MarkLessonForSGOInput, required: true }) },
  async resolve(_, { input: { sectionIds } }, { questionData }) {
    // for (const id of sectionIds) {
    const question = await questionData
      .find({
        questionUsageType: 'ESSAY',
        associatedTextSectionsIds: { $in: sectionIds },
      })
      .toArray()
    console.log(question.map((q: any) => q.questionParts.originalQuestion))
    // }
    return { marked: true }
  },
})
