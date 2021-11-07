import { objectType } from '@nexus/schema'

export const Quiz = objectType({
  name: 'Quiz',
  definition(t) {
    t.implements('Assignment')
    t.list.id('quizzableSections')
    t.boolean('finishedQuiz')
    t.boolean('startedQuiz')
    t.boolean('forcedFinish')
    t.boolean('isActive')
    t.float('responsibilityPoints')
  },
})
