import { objectType, unionType } from '@nexus/schema'

export const AnswerTypes = unionType({
  name: 'AnswerTypes',
  definition(t) {
    t.members(
      'ProblemSolutionAnswerType',
      'HowCauseEffectAnswerType',
      'WhyCauseEffectAnswerType'
    )
    t.resolveType((type) => {
      if (type.hasOwnProperty('problem')) {
        return 'ProblemSolutionAnswerType'
      }
      if (type.hasOwnProperty('before')) {
        return 'HowCauseEffectAnswerType'
      }
      return 'WhyCauseEffectAnswerType'
    })
  },
})

export const ProblemSolutionAnswerType = objectType({
  name: 'ProblemSolutionAnswerType',
  definition(t) {
    t.string('problem')
    t.string('reasonForProblem')
    t.string('solvedBy')
    t.string('whySolutionSolved')
  },
})

export const HowCauseEffectAnswerType = objectType({
  name: 'HowCauseEffectAnswerType',
  definition(t) {
    t.string('before')
    t.string('cause')
    t.string('after')
  },
})

export const WhyCauseEffectAnswerType = objectType({
  name: 'WhyCauseEffectAnswerType',
  definition(t) {
    t.string('ultimateCause')
    t.string('proximateCause')
  },
})
