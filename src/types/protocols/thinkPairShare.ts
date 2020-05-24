import { objectType } from '@nexus/schema'
import { Student } from '..'

export const ThinkPairShare = objectType({
  name: 'ThinkPairShare',
  definition(t) {
    t.implements('Protocol')
    t.list.field('studentPair', { type: Student })
    t.boolean('hadConversation')
  },
})
