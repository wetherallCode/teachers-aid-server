import { objectType, inputObjectType } from '@nexus/schema'

export const LessonTextSections = objectType({
  name: 'LessonTextSections',
  definition(t) {
    t.string('startingSection')
    t.string('endingSection')
  },
})
export const LessonTextSectionsInput = inputObjectType({
  name: 'LessonTextSectionsInput',
  definition(t) {
    t.string('startingSection', { required: true })
    t.string('endingSection', { required: true })
  },
})
