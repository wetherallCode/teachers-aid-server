import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ReadingGuide } from '.'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { Score } from '../assignments'

export const SubmitReadingGuideInput = inputObjectType({
  name: 'SubmitReadingGuideInput',
  definition(t) {
    t.id('readingGuideId', { required: true })
    t.boolean('late', { required: true })
    t.string('submitTime', { required: true })
    t.boolean('paperBased', { required: true })
    t.boolean('completeReadingGuide')
    t.float('responsibilityPoints', { required: true })
  },
})

export const SubmitReadingGuidePayload = objectType({
  name: 'SubmitReadingGuidePayload',
  definition(t) {
    t.field('readingGuide', { type: ReadingGuide })
  },
})

export const SubmitReadingGuide = mutationField('submitReadingGuide', {
  type: SubmitReadingGuidePayload,
  args: { input: arg({ type: SubmitReadingGuideInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        readingGuideId,
        late,
        submitTime,
        paperBased,
        completeReadingGuide,
        responsibilityPoints,
      },
    },
    { assignmentData, studentData, generalData }
  ) {
    const readingGuideValidation: NexusGenRootTypes['ReadingGuide'] =
      await assignmentData.findOne({
        _id: new ObjectId(readingGuideId),
      })
    const studentResponsibilityPoints: NexusGenRootTypes['ResponsibilityPoints'] =
      await studentData.findOne({
        'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
        markingPeriod: readingGuideValidation.markingPeriod,
        responsibilityPoints: { $exists: true },
      })

    const currentMarkingPeriod: NexusGenRootTypes['MarkingPeriod'] =
      await generalData.findOne({ currentMarkingPeriod: { $exists: true } })

    if (readingGuideValidation) {
      if (paperBased) {
        await assignmentData.updateOne(
          {
            _id: new ObjectId(readingGuideId),
          },
          {
            $set: {
              late,
              graded: true,
              missing: false,
              completed: completeReadingGuide,
              'score.earnedPoints': completeReadingGuide ? 10 : 2,
            },
          }
        )

        if (studentResponsibilityPoints) {
          studentData.updateOne(
            {
              'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
              markingPeriod: readingGuideValidation.markingPeriod,
              responsibilityPoints: { $exists: true },
              behavior: { $exists: false },
            },
            {
              $inc: {
                responsibilityPoints:
                  completeReadingGuide && late === false
                    ? responsibilityPoints
                    : completeReadingGuide && late
                    ? responsibilityPoints! / 2
                    : responsibilityPoints! / 4,
              },
            }
          )
        }

        const readingGuide = await assignmentData.findOne({
          _id: new ObjectId(readingGuideId),
        })

        return { readingGuide }
      }
    }

    function isLate() {
      const submittedDateTime: string = submitTime
      const dueDateTime: string = `${readingGuideValidation.dueDate}, ${readingGuideValidation.dueTime}`

      if (Date.parse(submittedDateTime) > Date.parse(dueDateTime)) {
        return true
      } else return false
    }

    if (readingGuideValidation) {
      assignmentData.updateOne(
        {
          _id: new ObjectId(readingGuideId),
        },
        {
          $set: {
            completed: true,
            graded: true,
            assigned: false,
            'score.earnedPoints': readingGuideValidation.score.maxPoints,
            late: isLate(),
            missing: false,
            'readingGuideFinal.submitted': true,
            'readingGuideFinal.submitTime': submitTime,
            'readingGuideFinal.responsibilityPoints':
              isLate() === true ? 0 : responsibilityPoints,
          },
        }
      )

      if (!readingGuideValidation.readingGuideFinal?.submitted) {
        studentData.updateOne(
          {
            'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
            markingPeriod: readingGuideValidation.markingPeriod,
            responsibilityPoints: { $exists: true },
            behavior: { $exists: false },
          },
          {
            $inc: {
              responsibilityPoints:
                isLate() === true ? 0 : responsibilityPoints,
            },
          }
        )
      }
      const readingGuide = await assignmentData.findOne({
        _id: new ObjectId(readingGuideId),
      })

      return { readingGuide }
    } else throw new Error('Reading Guide does not exist.')
  },
})
