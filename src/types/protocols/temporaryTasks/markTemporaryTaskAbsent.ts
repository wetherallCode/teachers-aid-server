import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
<<<<<<< HEAD
import { TemporaryTask } from '.'
=======
import { ObjectId } from 'mongodb'
import { TemporaryTask } from '.'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
>>>>>>> 300f0a97ab852bfc94b43dbcb056cfaa215d07ba

export const MarkTemporaryTaskAbsentInput = inputObjectType({
  name: 'MarkTemporaryTaskAbsentInput',
  definition(t) {
<<<<<<< HEAD
    t.id('taskId', { required: true })
    t.boolean('studentPresent')
=======
    t.id('_id', { required: true })
    t.boolean('studentPresent', { required: true })
>>>>>>> 300f0a97ab852bfc94b43dbcb056cfaa215d07ba
  },
})

export const MarkTemporaryTaskAbsentPayload = objectType({
  name: 'MarkTemporaryTaskAbsentPayload',
  definition(t) {
    t.field('temporaryTask', { type: TemporaryTask })
  },
})

<<<<<<< HEAD
// export const MarkTemporaryTaskAbsent = mutationField(
//   'markTemporaryTaskAbsent',
//   {
//     type: MarkTemporaryTaskAbsentPayload,
//     args: {
//       input: arg({ type: MarkTemporaryTaskAbsentInput, required: true }),
//     },
//     async resolve(_, { input: { taskId } }, {}) {},
//   }
// )
=======
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
>>>>>>> 300f0a97ab852bfc94b43dbcb056cfaa215d07ba
