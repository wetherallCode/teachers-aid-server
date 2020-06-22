import { unionType } from '@nexus/schema'

export const Organizers = unionType({
  name: 'Organizers',
  definition(t) {
    t.members('DevelopingOrganizer', 'AcademicOrganizer', 'AdvancedOrganizer')
    t.resolveType((organizer) => {
      if (organizer.hasOwnProperty('academicSentenceStructure')) {
        return 'AcademicOrganizer'
      }
      if (organizer.hasOwnProperty('developingSentenceStructure')) {
        return 'DevelopingOrganizer'
      }
      return 'AdvancedOrganizer'
    })
  },
})
