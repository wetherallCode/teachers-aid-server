import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'
import { ReadingGuide } from '.'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'

export const SubmitReadingGuideInput = inputObjectType({
  name: 'SubmitReadingGuideInput',
  definition(t) {
    t.id('readingGuideId', { required: true })
    t.boolean('late', { required: true })
    t.boolean('paperBased', { required: true })
    t.boolean('completeReadingGuide')
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
    { input: { readingGuideId, late, paperBased, completeReadingGuide } },
    { assignmentData, studentData }
  ) {
    const readingGuideValidation: NexusGenRootTypes['ReadingGuide'] = await assignmentData.findOne(
      {
        _id: new ObjectId(readingGuideId),
      }
    )
    const studentResponsibilityPoints: NexusGenRootTypes['ResponsibilityPoints'] = await studentData.findOne(
      {
        'student._id': new ObjectId(readingGuideValidation.hasOwner._id!),
        markingPeriod: readingGuideValidation.markingPeriod,
        responsibilityPoints: { $exists: true },
      }
    )

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
              'score.earnedPoints': completeReadingGuide ? 2 : 1,
            },
          }
        )

        const readingGuide = await assignmentData.findOne({
          _id: new ObjectId(readingGuideId),
        })

        return { readingGuide }
      }
    }

    function handleLate() {
      const submittedDate: string = new Date().toLocaleDateString()
      const submittedTime: string = new Date().toLocaleString().substring(10)

      let isLate: boolean = false

      if (submittedDate > readingGuideValidation.dueDate) {
        return (isLate = true)
      }
      if (
        readingGuideValidation.dueDate === submittedDate &&
        readingGuideValidation.dueTime > submittedTime
      ) {
        return (isLate = true)
      }
      return isLate
    }

    const isLate = handleLate()

    const {
      whyWasSectionOrganized,
      majorIssue,
      majorSolution,
      clarifyingQuestions,
    } = readingGuideValidation.readingGuideFinal!

    const clarifyingQuestionComplete = clarifyingQuestions.length! !== 0
    const majorSolutionComplete = majorSolution !== ''
    const majorIssueComplete = majorIssue !== ''
    const whyOrganizedComplete = whyWasSectionOrganized !== ''

    const complete =
      clarifyingQuestionComplete &&
      majorSolutionComplete &&
      majorIssueComplete &&
      whyOrganizedComplete

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
            'score.earnedPoints': complete ? 2 : 1,
            late: isLate,
            'readingGuideFinal.submitted': true,
            'readingGuideFinal.submitTime': new Date().toLocaleString(),
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
            $set: {
              responsibilityPoints:
                studentResponsibilityPoints.responsibilityPoints +
                (complete ? 2 : 1),
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
