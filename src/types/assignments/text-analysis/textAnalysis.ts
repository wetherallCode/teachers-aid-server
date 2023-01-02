import { enumType, objectType } from '@nexus/schema'

export const TextAnalysis = objectType({
  name: 'TextAnalysis',
  definition(t) {
    t.implements('Assignment')
    t.boolean('mainIdeasCompletedInClass')
    t.field('textAnalysisCompletion', { type: TextAnalysisCompletionEnum })
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
