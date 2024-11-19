import { enumType } from '@nexus/schema'

export const TextAnalysisCompletionEnum = enumType({
  name: 'TextAnalysisCompletionEnum',
  members: [
    'FULL_COMPLETION',
    'PARTIAL_COMPLETION',
    'MINOR_COMPLETION',
    'MAIN_IDEAS_ONLY',
    'MARKUP_ONLY',
    'NO_ATTEMPT',
  ],
})
