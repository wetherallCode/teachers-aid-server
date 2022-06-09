import { objectType, enumType } from '@nexus/schema'

export const BehaviorType = objectType({
  name: 'BehaviorType',
  definition(t) {
    t.id('_id', { nullable: true })
    t.string('behaviorName')
    t.field('behaviorQuality', { type: BehaviorQualityEnum })
    t.field('behaviorCategory', { type: BehaviorCategoryEnum })
    t.int('points')
  },
})

export const BehaviorQualityEnum = enumType({
  name: 'BehaviorQualityEnum',
  members: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
})

export const BehaviorCategoryEnum = enumType({
  name: 'BehaviorCategoryEnum',
  members: [
    'INDEPENDANT_WORK',
    'QUESTION_AND_ANSWER',
    'POSITIVE_BEHAVIOR',
    'NEGATIVE_BEHAVIOR',
  ],
})
