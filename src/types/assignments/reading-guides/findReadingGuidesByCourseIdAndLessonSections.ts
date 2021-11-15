import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ReadingGuide } from '.'

export const FindReadingGuidesByCourseIdAndLessonSectionsInput =
  inputObjectType({
    name: 'FindReadingGuidesByCourseIdAndLessonSectionsInput',
    definition(t) {
      t.list.id('sectionIds', { required: true })
    },
  })

export const FindReadingGuidesByCourseIdAndLessonSectionsPayload = objectType({
  name: 'FindReadingGuidesByCourseIdAndLessonSectionsPayload',
  definition(t) {
    t.list.field('readingGuides', { type: ReadingGuide })
  },
})

export const FindReadingGuidesByCourseIdAndLessonSections = queryField(
  'findReadingGuidesByCourseIdAndLessonSections',
  {
    type: FindReadingGuidesByCourseIdAndLessonSectionsPayload,
    args: {
      input: arg({
        type: FindReadingGuidesByCourseIdAndLessonSectionsInput,
        required: true,
      }),
    },
    async resolve(_, { input: {} }, {}) {},
  }
)
