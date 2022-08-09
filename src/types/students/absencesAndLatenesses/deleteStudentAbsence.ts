import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const DeleteStudentAbsenceInput = inputObjectType({
  name: 'DeleteStudentAbsenceInput',
  definition(t) {
    t.id('absenceId', { required: true })
  },
})

export const DeleteStudentAbsencePayload = objectType({
  name: 'DeleteStudentAbsencePayload',
  definition(t) {
    t.boolean('removed')
  },
})

// export const DeleteStudentAbsence = mutationField('deleteStudentAbsence', {
//   type: DeleteStudentAbsencePayload,
//   args: { input: arg({ type: DeleteStudentAbsenceInput, required: true }) },
//   async resolve(_, { input: { absenceId } }, { studentData }) {
//     const { deletedCount } = await studentData.deleteOne({
//       _id: new ObjectId(absenceId),
//     })

//     if (deletedCount === 1) {
//       return { removed: true }
//     }
//     return { removed: false }
//   },
// })
