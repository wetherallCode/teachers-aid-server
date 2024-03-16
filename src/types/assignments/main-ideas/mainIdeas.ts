import { objectType } from '@nexus/schema'

export const Essay = objectType({
  name: 'Essay',
  definition(t) {
    t.implements('Assignment')
    t.boolean('partiallyComplete')
    t.boolean('fullyComplete')
    t.boolean('workedWellWithGroup')
    t.boolean('startedPromptly')
  },
})

