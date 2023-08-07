import { objectType, enumType, unionType, interfaceType } from '@nexus/schema'
import { Student } from '../student'
import { Course } from '../../courses'
import { WritingLevelEnum } from './progressTracker'

// writingMetrics
// topic statement
// ability to identify the structure of the question
// ability to identify key parts of sentence
// ability to use structure to form topic statement

// Answer
// ability to use correct structure
// ability to transition to each part of the structure
// Conclusion
// ability to set conlcusion up correctly
// ability to use find a logical consequence of the topic

export const WritingMetrics = objectType({
  name: 'WritingMetrics',
  definition(t) {
    t.typeName
    t.implements('ProgressMetrics')
    t.field('overallWritingMetric', { type: OverallWritingMetric })
    t.field('howProblemSolutionMetrics', { type: HowProblemSolutionMetrics })
    t.field('howCauseEffectMetrics', { type: HowCauseEffectMetrics })
    t.field('whyCauseEffectMetrics', { type: WhyCauseEffectMetrics })
    t.field('inCourse', { type: Course })
    // t.boolean('writingLevelComplete')
    // t.int('pointsToLevelUp')
    // t.field('writingLevel', { type: WritingLevel })
    // t.field('developingHowProblemSolution', {
    //   type: DevelopingHowProblemSolution,
    // })

    // t.int('keyPartsOfQuestion', {
    //   description: 'ability to identify key parts of sentence',
    // }) //developing
    // t.int('topicSentenceFormation', {
    //   description: 'ability to use structure to form topic statement',
    // }) // developing
    // t.int('correctStructure') // developing level
    // t.int('transitionsWithinStructure') // Academic Level
    // t.int('conclusionSetup') // developing level
    // t.int('logicalConsequence') // developing level
  },
})

// export const WritingLevelEnum = enumType({
//   name: 'WritingLevelEnum',
//   members: ['DEVELOPING', 'ACADEMIC', 'ADVANCED'],
// })

export const OverallWritingMetric = objectType({
  name: 'OverallWritingMetric',
  definition(t) {
    t.float('levelPoints')
    t.field('overallWritingLevel', { type: WritingLevelEnum })
  },
})

export const HowProblemSolutionMetrics = objectType({
  name: 'HowProblemSolutionMetrics',
  definition(t) {
    t.int('levelPoints')
    t.field('howProblemSolutionLevel', { type: WritingLevelEnum })
  },
})

export const HowCauseEffectMetrics = objectType({
  name: 'HowCauseEffectMetrics',
  definition(t) {
    t.int('levelPoints')
    t.field('howCauseEffectLevel', { type: WritingLevelEnum })
  },
})

export const WhyCauseEffectMetrics = objectType({
  name: 'WhyCauseEffectMetrics',
  definition(t) {
    t.int('levelPoints')
    t.field('whyCauseEffectLevel', { type: WritingLevelEnum })
  },
})
