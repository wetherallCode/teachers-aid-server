import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { StudentAbsence } from '.'
import { ObjectId } from 'mongodb'

export const RemoveAbsenceInput = inputObjectType({
  name: 'RemoveAbsenceInput',
  definition(t) {
    t.id('_id', { required: true })
  },
})

export const RemoveAbsencePayload = objectType({
  name: 'RemoveAbsencePayload',
  definition(t) {
    t.boolean('removed')
  },
})

export const RemoveAbsence = mutationField('removeAbsence', {
  type: RemoveAbsencePayload,
  args: { input: arg({ type: RemoveAbsenceInput, required: true }) },
  async resolve(_, { input: { _id } }, { studentData }) {
    const absence = await studentData.findOne({ _id: new ObjectId(_id) })

    if (absence) {
      const { deletedCount } = await studentData.deleteOne({
        _id: new ObjectId(_id),
      })
      if (deletedCount === 1) {
        return { removed: true }
      }
      throw new Error('Something went wrong')
    } else throw new Error('Absence does not exist!')
  },
})
