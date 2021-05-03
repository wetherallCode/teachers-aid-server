import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { TemporaryTask } from '.'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const MarkTemporaryTaskAbsentInput = inputObjectType({
  name: 'MarkTemporaryTaskAbsentInput',
  definition(t) {
    t.id('_id', { required: true })
    t.boolean('studentPresent', { required: true })
  },
})

export const MarkTemporaryTaskAbsentPayload = objectType({
  name: 'MarkTemporaryTaskAbsentPayload',
  definition(t) {
    t.field('temporaryTask', { type: TemporaryTask })
  },
})

export const MarkTemporaryTaskAbsent = mutationField('markTemporaryTaskAbsent', {
  type: MarkTemporaryTaskAbsentPayload,
  args: { input: arg({ type: MarkTemporaryTaskAbsentInput, required: true }) },
  async resolve(
    _,
    {
      input: { _id, studentPresent},
    },
    { temporaryTaskData }
  ) {

    const temporaryTaskCheck: NexusGenRootTypes['TemporaryTask'] = await temporaryTaskData.findOne(
      {
        _id: new ObjectId(_id),
      }
    )
    if (temporaryTaskCheck) {
      await temporaryTaskData.updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: {

            studentPresent,
          },
        }
      )

    }
    const temporaryTask: NexusGenRootTypes['TemporaryTask'] = await temporaryTaskData.findOne(
      {
        _id: new ObjectId(_id),
      }
    )

    return { temporaryTask }
}}
)