import { objectType } from '@nexus/schema'

export const Quiz = objectType({
  name: 'Quiz',
  definition(t) {
    t.implements('Assignment')
    t.list.string('quizzableSections')
    t.boolean('finishedQuiz')
    t.boolean('isActive')
  },
})
