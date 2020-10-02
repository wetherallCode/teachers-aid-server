import { enumType, objectType } from '@nexus/schema'

export const ParentContact = objectType({
  name: 'ParentContact',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('contactType', { type: ContactTypeEnum })
    t.string('date')
    t.id('studentId')
    t.string('contentOfContact')
    t.id('teacherId')
  },
})

export const ContactTypeEnum = enumType({
  name: 'ContactTypeEnum',
  members: ['PHONE', 'EMAIL', 'VIDEO'],
})
