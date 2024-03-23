import { enumType, objectType } from '@nexus/schema'

export const TextAnalysis = objectType({
  name: 'TextAnalysis',
  definition(t) {
    t.implements('Assignment')
    t.field('textAnalysisCompletion', { type: TextAnalysisCompletionEnum })
    t.boolean('finishedEssentialQuestion')
    t.boolean('workedWellWithGroup')
    t.boolean('startedPromptly')
  },
})

export const TextAnalysisCompletionEnum = enumType({
  name: 'TextAnalysisCompletionEnum',
  members: [
    'PARTIAL_COMPLETION',
    'FULL_COMPLETION',
    'NO_ATTEMPT',
    'MAIN_IDEAS_ONLY',
    'MARKUP_ONLY',
  ],
})
