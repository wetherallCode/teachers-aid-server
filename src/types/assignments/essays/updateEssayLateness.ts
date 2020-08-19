import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay } from '.'
import { ObjectId } from 'mongodb'

export const UpdateEssayLatenessInput = inputObjectType({
  name: 'UpdateEssayLatenessInput',
  definition(t) {
    t.id('essayId', { required: true })
    t.boolean('lateness', { required: true })
  },
})

export const UpdateEssayLatenessPayload = objectType({
  name: 'UpdateEssayLatenessPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const UpdateEssayLateness = mutationField('updateEssayLateness', {
  type: UpdateEssayLatenessPayload,
  args: { input: arg({ type: UpdateEssayLatenessInput, required: true }) },
  async resolve(_, { input: { essayId, lateness } }, { assignmentData }) {
    const essayValidation = await assignmentData.findOne({
      _id: new ObjectId(essayId),
    })
    if (essayValidation) {
      await assignmentData.updateOne(
        { _id: new Object(essayId) },
        {
          $set: { late: lateness },
        }
      )
      const essay = await assignmentData.findOne({ _id: new ObjectId(essayId) })
      return { essay }
    } else throw new Error('Essay does not exist')
  },
})
