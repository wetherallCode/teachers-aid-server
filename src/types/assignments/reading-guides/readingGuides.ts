import { objectType } from '@nexus/schema'

export const Reading_Guide = objectType({
  name: 'Reading_Guide',
  definition(t) {
    t.implements('Assignment')
    t.string('completion')
  },
})
