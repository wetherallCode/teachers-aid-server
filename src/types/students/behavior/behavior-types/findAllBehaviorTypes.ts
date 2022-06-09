import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { BehaviorType } from './behaviorType'

// export const FindAllBehaviorTypesInput = inputObjectType({
//     name: 'FindAllBehaviorTypesInput',
//     definition(t) {
//       t.('',{required: true})
//     }
// })

export const FindAllBehaviorTypesPayload = objectType({
  name: 'FindAllBehaviorTypesPayload',
  definition(t) {
    t.list.field('behaviorTypes', { type: BehaviorType })
  },
})

export const FindAllBehaviorTypes = queryField('findAllBehaviorTypes', {
  type: FindAllBehaviorTypesPayload,
  // args: { input: arg({ type: FindAllBehaviorTypesInput, required: true }) },
  async resolve(_, __, { behaviorData }) {
    const behaviorTypes = await behaviorData.find().toArray()
    return { behaviorTypes }
  },
})
