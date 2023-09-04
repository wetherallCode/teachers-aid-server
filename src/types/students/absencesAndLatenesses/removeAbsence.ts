import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { StudentAbsence } from '..'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { preparedAndReadyInformation } from '../../../utilities'

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
  async resolve(
    _,
    { input: { _id } },
    { studentData, lessonData, behaviorData }
  ) {
    const absence: NexusGenRootTypes['StudentAbsence'] =
      await studentData.findOne({ _id: new ObjectId(_id) })

    const lessonStartedCheck: NexusGenRootTypes['Lesson'] =
      await lessonData.findOne({
        assignedDate: absence.dayAbsent,
        assignedCourses: absence.student.inCourses[0],
      })

    const readyForClassCheck = await studentData.findOne({
      'student._id': new ObjectId(absence.student._id!),
      date: absence.dayAbsent,
      'behavior._id': new ObjectId(preparedAndReadyInformation.id),
    })

    if (absence) {
      const { deletedCount } = await studentData.deleteOne({
        _id: new ObjectId(_id),
      })
      if (deletedCount === 1) {
        if (lessonStartedCheck) {
          if (lessonStartedCheck.lessonStarted && !readyForClassCheck) {
            const behavior = await behaviorData.findOne({
              _id: new ObjectId(preparedAndReadyInformation.id),
            })

            const studentBehavior: NexusGenRootTypes['StudentBehavior'] = {
              behavior: behavior,
              date: new Date().toLocaleDateString(),
              student: absence.student,
              responsibilityPoints:
                preparedAndReadyInformation.responsiblityPoints,
              markingPeriod: absence.markingPeriod,
            }

            const { insertedId } = await studentData.insertOne(studentBehavior)
            studentBehavior._id = insertedId

            await studentData.updateOne(
              {
                'student._id': new ObjectId(absence.student._id!),
                markingPeriod: absence.markingPeriod,
                responsibilityPoints: { $exists: true },
                behavior: { $exists: false },
              },
              {
                $inc: {
                  responsibilityPoints:
                    preparedAndReadyInformation.responsiblityPoints,
                },
              }
            )
          }
        }

        return { removed: true }
      }
      throw new Error('Something went wrong')
    } else throw new Error('Absence does not exist!')
  },
})
