import { enumType, objectType } from '@nexus/schema'

export const TextAnalysis = objectType({
  name: 'TextAnalysis',
  definition(t) {
    t.implements('Assignment')
    t.field('textAnalysisCompletion', { type: TextAnalysisCompletionEnum })
    // t.boolean('finishedEssential Question')
  },
})

export const TextAnalysisCompletionEnum = enumType({
  name: 'TextAnalysisCompletionEnum',
  members: [
    'MAIN_IDEAS_AND_MARKUP',
    'MAIN_IDEAS_ONLY',
    'MARKUP_ONLY',
    'PARTIAL_COMPLETION',
    'NOT_COMPLETE',
  ],
})
