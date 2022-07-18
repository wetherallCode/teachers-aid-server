import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

// export const ModifyExistingStudentBehaviorsInput = inputObjectType({
//     name: 'ModifyExistingStudentBehaviorsInput',
//     definition(t) {
//       t.('',{required: true})
//     }
// })

export const ModifyExistingStudentBehaviorsPayload = objectType({
  name: 'ModifyExistingStudentBehaviorsPayload',
  definition(t) {
    t.boolean('modified')
  },
})

export const ModifyExistingStudentBehaviors = mutationField(
  'modifyExistingStudentBehaviors',
  {
    type: ModifyExistingStudentBehaviorsPayload,
    // args: {
    //   input: arg({ type: ModifyExistingStudentBehaviorsInput, required: true }),
    // },
    async resolve(_, __, { behaviorData }) {
      behaviorData
      // behaviorData.updateMany({}, { $set: { forTeachersAid: true } })
      return { modified: true }
    },
  }
)
