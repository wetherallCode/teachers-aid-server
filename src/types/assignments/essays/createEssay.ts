import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay, ReadingsInput, TopicInput } from '.'

export const CreateEssayInput = inputObjectType({
  name: 'CreateEssayInput',
  definition(t) {
    t.list.field('topic', { type: TopicInput, required: true })
    t.field('readings', { type: ReadingsInput, required: true })
    t.string('hasAssignerId', { required: true })
  },
})

export const CreateEssayPayload = objectType({
  name: 'CreateEssayPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

// export const CreateEssay = mutationField('createEssay', {
//   type:CreateEssayPayload,
//   args: { input: arg({ type: CreateEssayInput, required: true }) },
//   async resolve(_, {input: {}}, {}) {

//   },
// });
