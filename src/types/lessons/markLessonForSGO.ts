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
    const questions = await questionData
      .find({
        questionUsageType: 'ESSAY',
        associatedTextSectionsIds: { $in: sectionIds },
      })
      .toArray()

    const { modifiedCount } = await questionData.updateMany(
      {
        questionUsageType: 'ESSAY',
        associatedTextSectionsIds: { $in: sectionIds },
      },
      { $set: { sgoQuestion: true } }
    )

    return { marked: questions.length === modifiedCount ? true : false }
  },
})
