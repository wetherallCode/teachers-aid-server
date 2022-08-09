import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const DeleteStudentOutOfClassInput = inputObjectType({
  name: 'DeleteStudentOutOfClassInput',
  definition(t) {
    t.id('outOfClassId', { required: true })
  },
})

export const DeleteStudentOutOfClassPayload = objectType({
  name: 'DeleteStudentOutOfClassPayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const DeleteStudentOutOfClass = mutationField(
  'deleteStudentOutOfClass',
  {
    type: DeleteStudentOutOfClassPayload,
    args: {
      input: arg({ type: DeleteStudentOutOfClassInput, required: true }),
    },
    async resolve(_, { input: { outOfClassId } }, { studentData }) {
      const outOfClassCheck = await studentData.findOne({
        _id: new ObjectId(outOfClassId),
      })
      if (outOfClassCheck) {
        const { deletedCount } = await studentData.deleteOne({
          _id: new ObjectId(outOfClassId),
        })
        return { removed: deletedCount === 1 ? true : false }
      } else throw new Error('OutOfClass Entry does not exist')
    },
  }
)
