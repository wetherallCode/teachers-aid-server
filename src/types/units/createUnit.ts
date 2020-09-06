import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Unit } from '.'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'

export const CreateUnitInput = inputObjectType({
  name: 'CreateUnitInput',
  definition(t) {
    t.string('unitName', { required: true })
  },
})

export const CreateUnitPayload = objectType({
  name: 'CreateUnitPayload',
  definition(t) {
    t.field('unit', { type: Unit })
  },
})

export const CreateUnit = mutationField('createUnit', {
  type: CreateUnitPayload,
  args: { input: arg({ type: CreateUnitInput, required: true }) },
  async resolve(_, { input: { unitName } }, { lessonData }) {
    const unit: NexusGenRootTypes['Unit'] = {
      unitName,
    }
    const { insertedId } = await lessonData.insertOne(unit)
    unit._id = insertedId
    return { unit }
  },
})
