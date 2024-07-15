import { enumType } from '@nexus/schema'

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
