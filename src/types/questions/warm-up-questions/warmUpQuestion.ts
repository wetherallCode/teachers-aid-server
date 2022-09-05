import { objectType } from '@nexus/schema'

export const WarmUpQuestion = objectType({
  name: 'WarmUpQuestion',
  definition(t) {
    t.implements('Question')
    t.list.id('associatedTextSectionsIds')
    t.string('warmUpQuestion')
  },
})
