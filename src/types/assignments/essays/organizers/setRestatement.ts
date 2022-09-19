import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const SetRestatementInput = inputObjectType({
  name: 'SetRestatementInput',
  definition(t) {
    t.id('essayId', { required: true })
    t.string('restatement', { required: true })
  },
})

export const SetRestatementPayload = objectType({
  name: 'SetRestatementPayload',
  definition(t) {
    t.boolean('set')
  },
})

export const SetRestatement = mutationField('setRestatement', {
  type: SetRestatementPayload,
  args: { input: arg({ type: SetRestatementInput, required: true }) },
  async resolve(_, { input: { essayId, restatement } }, { assignmentData }) {
    const essay = await assignmentData.findOne({ _id: new ObjectId(essayId) })
    if (essay) {
      const { modifiedCount } = assignmentData.updateOne(
        { _id: new ObjectId(essayId) },
        { $set: { 'workingDraft.organizer.restatement': restatement } }
      )
      return { set: modifiedCount === 1 ? true : false }
    } else throw new Error('Essay not found.')
  },
})
