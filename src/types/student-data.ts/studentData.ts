import { interfaceType, objectType } from '@nexus/schema'

export const StudentData = objectType({
  name: 'StudentData',
  definition(t) {
    t.id('_id', { nullable: true })
    // t.resolveType((course))
  },
})
