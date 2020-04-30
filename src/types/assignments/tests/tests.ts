import { objectType } from '@nexus/schema'

export const Test = objectType({
  name: 'Test',
  definition(t) {
    t.implements('Assignment')
    t.string('testName')
  },
})
