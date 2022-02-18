import { interfaceType } from '@nexus/schema'

export const User = interfaceType({
  name: 'User',
  definition(t) {
    t.id('_id', { nullable: true })
    t.string('userName')
    t.string('firstName')
    t.string('middleName', { nullable: true })
    t.string('lastName')
    t.string('email', { nullable: true })
    t.string('password')
    t.boolean('isActive')
    t.resolveType((user) => {
      if (user.hasOwnProperty('title')) {
        return 'Teacher'
      }
      return 'Student'
    })
  },
})
