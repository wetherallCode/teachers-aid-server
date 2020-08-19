import { queryField, arg, inputObjectType, objectType } from '@nexus/schema'
import { Essay } from '.'
import { ObjectID } from 'mongodb'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'

export const FindEssayByIdInput = inputObjectType({
  name: 'FindEssayByIdInput',
  definition(t) {
    t.id('_id', { required: true })
  },
})

export const FindEssayByIdPayload = objectType({
  name: 'FindEssayByIdPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const FindEssayById = queryField('findEssayById', {
  type: FindEssayByIdPayload,
  args: { input: arg({ type: FindEssayByIdInput, required: true }) },
  async resolve(_, { input: { _id } }, { assignmentData }) {
    const essay: NexusGenRootTypes['Essay'] = await assignmentData.findOne({
      _id: new ObjectID(_id),
    })

    return { essay }
  },
})
