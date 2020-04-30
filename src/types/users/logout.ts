import { mutationField } from '@nexus/schema'

export const logout = mutationField('logout', {
  type: 'Boolean',
  async resolve(_, __, { req }) {
    if (req.session) {
      // ends the session logging the user out
      req.session.destroy()
      return true
    } else return false
  },
})
