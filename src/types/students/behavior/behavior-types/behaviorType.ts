import { objectType, enumType } from '@nexus/schema'

export const BehaviorType = objectType({
  name: 'BehaviorType',
  definition(t) {
    t.id('_id', { nullable: true })
    t.string('behaviorName')
    t.field('behaviorQuality', { type: BehaviorQualityEnum })
    t.field('behaviorCategory', { type: BehaviorCategoryEnum })
    t.boolean('forTeachersAid')
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
    'INDEPENDENT_WORK',
    'PREPAREDNESS',
    'QUESTION_AND_ANSWER',
    'POSITIVE_BEHAVIOR',
    'NEGATIVE_BEHAVIOR',
  ],
})
