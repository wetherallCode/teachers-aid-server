import { interfaceType, objectType } from '@nexus/schema'
import { Student, ContactInfo } from '.'

import { ResponsibilityPoints } from './responsibilityPoints'

export const StudentInformation = objectType({
  name: 'StudentInformation',
  definition(t) {
    t.id('_id', { nullable: true })
    t.field('student', { type: Student })
    t.list.field('contactInfo', { type: ContactInfo })

    // t.resolveType((course))
  },
})

// export const StudentSocialStudiesInformation =
