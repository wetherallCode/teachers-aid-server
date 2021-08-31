import { objectType } from '@nexus/schema'

export const Behavior = objectType({
  name: 'Behavior',
  definition(t) {
    t.id('_id', { nullable: true })
  },
})
