import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const MarkExemptInput = inputObjectType({
  name: 'MarkExemptInput',
  definition(t) {
    t.id('assignmentId', { required: true })
    t.boolean('exemptStatus', { required: true })
  },
})

export const MarkExemptPayload = objectType({
  name: 'MarkExemptPayload',
  definition(t) {
    t.boolean('marked')
  },
})

export const MarkExempt = mutationField('markExempt', {
  type: MarkExemptPayload,
  args: { input: arg({ type: MarkExemptInput, required: true }) },
  async resolve(
    _,
    { input: { assignmentId, exemptStatus } },
    { assignmentData }
  ) {
    const assignmentValidation = await assignmentData.findOne({
      _id: new ObjectId(assignmentId),
    })
    if (assignmentValidation) {
      const { modifiedCount } = await assignmentData.updateOne(
        { _id: new ObjectId(assignmentId) },
        {
          $set: { exempt: exemptStatus },
        }
      )

      return { marked: modifiedCount === 1 ? true : false }
    } else throw new Error('Assignment Does Not Exist!')
  },
})
