import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { TemporaryTask } from '.'

export const MarkTemporaryTaskAbsentInput = inputObjectType({
  name: 'MarkTemporaryTaskAbsentInput',
  definition(t) {
    t.id('taskId', { required: true })
    t.boolean('studentPresent')
  },
})

export const MarkTemporaryTaskAbsentPayload = objectType({
  name: 'MarkTemporaryTaskAbsentPayload',
  definition(t) {
    t.field('temporaryTask', { type: TemporaryTask })
  },
})

export const MarkTemporaryTaskAbsent = mutationField(
  'markTemporaryTaskAbsent',
  {
    type: MarkTemporaryTaskAbsentPayload,
    args: {
      input: arg({ type: MarkTemporaryTaskAbsentInput, required: true }),
    },
    async resolve(
      _,
      { input: { taskId, studentPresent } },
      { temporaryTaskData }
    ) {
      const check = await temporaryTaskData.findOne({
        _id: new ObjectId(taskId),
      })

      if (check) {
        await temporaryTaskData.updateOne(
          { _id: new ObjectId(taskId) },
          { $set: { studentPresent } }
        )
      }
      const temporaryTask = await temporaryTaskData.findOne({
        _id: new ObjectId(taskId),
      })

      return { temporaryTask }
    },
  }
)
