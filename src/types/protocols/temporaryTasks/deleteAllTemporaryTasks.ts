import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'

export const DeleteAllTemporaryTasksPayload = objectType({
  name: 'DeleteAllTemporaryTasksPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const DeleteAllTemporaryTasks = mutationField(
  'deleteAllTemporaryTasks',
  {
    type: DeleteAllTemporaryTasksPayload,
    async resolve(_, __, { temporaryTaskData }) {
      const { deletedCount } = await temporaryTaskData.deleteMany()
      console.log(deletedCount)
      // if (deletedCount === 1) {
      //   return { removed: true }
      // }
      return { removed: true }
    },
  }
)
