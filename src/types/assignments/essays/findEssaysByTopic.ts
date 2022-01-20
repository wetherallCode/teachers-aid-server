import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { Essay } from '.'

export const FindEssaysByTopicInput = inputObjectType({
  name: 'FindEssaysByTopicInput',
  definition(t) {
    t.string('question', { required: true })
  },
})

export const FindEssaysByTopicPayload = objectType({
  name: 'FindEssaysByTopicPayload',
  definition(t) {
    t.list.field('essays', { type: Essay })
  },
})

export const FindEssaysByTopic = queryField('findEssaysByTopic', {
  type: FindEssaysByTopicPayload,
  args: { input: arg({ type: FindEssaysByTopicInput, required: true }) },
  async resolve(_, { input: { question } }, { assignmentData }) {
    const essays = await assignmentData
      .find({ 'topic.question': question })
      .toArray()
    return { essays }
  },
})
