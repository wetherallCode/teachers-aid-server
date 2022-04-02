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
    t.float('responsibilityPoints')
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

    function handleLateness() {
      const submittedDateTime: string = submitTime
      const dueDateTime: string = `${readingGuideValidation.dueDate}, ${readingGuideValidation.dueTime}`

      if (Date.parse(submittedDateTime) > Date.parse(dueDateTime)) {
        return true
      } else return false
    }

    const {
      // majorIssue,
      // majorSolution,
      // clarifyingQuestions,
    } = readingGuideValidation.readingGuideFinal!

    // const clarifyingQuestionComplete = clarifyingQuestions.length! !== 0
    // const majorSolutionComplete = majorSolution !== ''
    // const majorIssueComplete = majorIssue !== ''

    const complete = true
    // clarifyingQuestionComplete && majorSolutionComplete && majorIssueComplete

    if (readingGuideValidation) {
      assignmentData.updateOne(
        {
          _id: new ObjectId(readingGuideId),
        },
        {
          $set: {
            completed: complete,
            graded: true,
            assigned: false,
            'score.earnedPoints': readingGuideValidation.score.maxPoints,
            // complete && handleLateness() === false
            //   ? readingGuideValidation.score.maxPoints
            //   : complete && handleLateness() === true
            //   ? readingGuideValidation.score.maxPoints / 2
            //   : 2,
            late: handleLateness(),
            'readingGuideFinal.submitted': true,
            'readingGuideFinal.submitTime': submitTime,
          },
        }
      )
      if (!readingGuideValidation.readingGuideFinal?.submitted) {
        studentData.updateOne(
          {
            'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
            markingPeriod: readingGuideValidation.markingPeriod,
            responsibilityPoints: { $exists: true },
          },
          {
            $inc: {
              responsibilityPoints:
                // complete && handleLateness() === false
                //   ? readingGuideValidation.score.maxPoints + 2
                //   : complete && handleLateness() === true
                //   ? (readingGuideValidation.score.maxPoints / 2) + 2
                //   : 3,
                handleLateness() === true
                  ? readingGuideValidation.score.maxPoints / 2 +
                    readingGuideValidation.score.maxPoints
                  : readingGuideValidation.score.maxPoints +
                    readingGuideValidation.score.maxPoints,
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
