import { objectType } from '@nexus/schema'
import { TextAnalysisCompletionEnum } from './TextAnalysisCompletionEnum'

export const TextAnalysis = objectType({
  name: 'TextAnalysis',
  definition(t) {
    t.implements('Assignment')
    t.field('textAnalysisCompletion', { type: TextAnalysisCompletionEnum })
    t.boolean('finishedEssentialQuestion')
    t.boolean('workedWellWithGroup')
    t.boolean('onTask')
    t.boolean('startedPromptly')
  },
})
