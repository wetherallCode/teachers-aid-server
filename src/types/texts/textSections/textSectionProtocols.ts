import { objectType, inputObjectType, enumType } from '@nexus/schema'

export const TextSectionProtocols = objectType({
  name: 'TextSectionProtocols',
  description: 'Protocol suggestions for including in a LessonPlan',
  definition(t) {
    t.field('activityType', { type: ProtocolActivityTypes })
    t.field('academicOutcomeTypes', { type: AcademicOutcomeTypes })
    t.string('task')
    t.string('directions', { nullable: true })
    t.boolean('completed')
    t.boolean('isActive')
  },
})

export const TextSectionProtocolsInput = inputObjectType({
  name: 'TextSectionProtocolsInput',
  definition(t) {
    t.field('activityType', {
      type: ProtocolActivityTypes,
      required: true,
    })
    t.field('academicOutcomeTypes', {
      type: AcademicOutcomeTypes,
      required: true,
    })
    t.string('task', { required: true })
    t.string('directions', { required: false })
    t.boolean('isActive', { required: true })
    t.boolean('completed', { required: true })
  },
})

export const ProtocolActivityTypes = enumType({
  name: 'ProtocolActivityTypes',
  members: ['THINK_PAIR_SHARE', 'INDIVIDUAL', 'SMALL_GROUP'],
})

export const AcademicOutcomeTypes = enumType({
  name: 'AcademicOutcomeTypes',
  members: [
    'SCHEMA_BUIDING',
    'LOGIC_BUILDING',
    'SOCRATIC_QUESTIONS',
    'CAUSE_AND_EFFECT_RECOGNITION',
  ],
})
