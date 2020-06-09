import { objectType } from '@nexus/schema'

export const ContactInfo = objectType({
  name: 'ContactInfo',
  definition(t) {
    t.string('guardianFirstName')
    t.string('guardianLastName')
    t.string('guardianPhone')
    t.string('guardianEmail')
  },
})
