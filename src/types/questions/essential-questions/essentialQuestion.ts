import { objectType } from '@nexus/schema'

export const EssentialQuestion = objectType({
  name: 'EssentialQuestion',
  definition(t) {
    t.implements('Question')
    t.list.id('associatedTextSectionsIds')
    t.string('question')
  },
})
