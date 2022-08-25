import { objectType } from '@nexus/schema'

export const ProfessionalDevelopment = objectType({
  name: 'ProfessionalDevelopment',
  definition(t) {
    t.id('_id', { nullable: true })
    t.string('name')
    t.string('date')
    t.float('developmentHours')
  },
})
