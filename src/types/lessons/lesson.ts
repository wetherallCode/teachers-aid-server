import { objectType } from '@nexus/schema'

export const Lesson = objectType({
  name: 'Lesson',
  definition(t) {
    t.date('assignedDate')
  },
})
