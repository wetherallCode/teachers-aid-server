import { enumType } from '@nexus/schema'

export const DynamicLessonEnums = enumType({
  name: 'DynamicLessonEnums',
  members: [
    'ON',
    'OFF',
    'WARM_UP',
    'PROTOCOLS',
    'VOCAB',
    'LESSON_DETAILS',
    'EXIT_ACTIVITY',
    'ASSIGNED_SEATING',
  ],
})
