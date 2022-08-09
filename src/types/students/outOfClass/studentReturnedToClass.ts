import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const StudentReturnedToClassInput = inputObjectType({
  name: 'StudentReturnedToClassInput',
  definition(t) {
    t.id('outOfClassId', { required: true })
  },
})

export const StudentReturnedToClassPayload = objectType({
  name: 'StudentReturnedToClassPayload',
  definition(t) {
    t.boolean('returned')
  },
})

export const StudentReturnedToClass = mutationField('studentReturnedToClass', {
  type: StudentReturnedToClassPayload,
  args: { input: arg({ type: StudentReturnedToClassInput, required: true }) },
  async resolve(_, { input: { outOfClassId } }, { studentData }) {
    const outOfClassCheck = await studentData.findOne({
      _id: new ObjectId(outOfClassId),
    })
    if (outOfClassCheck) {
      const { modifiedCount } = await studentData.updateOne(
        { _id: new ObjectId(outOfClassId) },
        {
          $set: {
            returnTime: new Date().toLocaleTimeString(),
            hasReturned: true,
          },
        }
      )
      return { returned: modifiedCount === 1 ? true : false }
    } else throw new Error('OutOfClass Entry does not exist')
  },
})
