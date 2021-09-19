import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const RemoveStudentBehaviorInput = inputObjectType({
  name: 'RemoveStudentBehaviorInput',
  definition(t) {
    t.id('studentBehaviorId', { required: true })
  },
})

export const RemoveStudentBehaviorPayload = objectType({
  name: 'RemoveStudentBehaviorPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const RemoveStudentBehavior = mutationField('removeStudentBehavior', {
  type: RemoveStudentBehaviorPayload,
  args: { input: arg({ type: RemoveStudentBehaviorInput, required: true }) },
  async resolve(_, { input: { studentBehaviorId } }, { studentData }) {
    studentBehaviorId
    studentData
    return { removed: true }
  },
})
