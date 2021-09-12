import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ReadingGuide, InformationStructureEnum } from '.'
import { ObjectId } from 'mongodb'

export const UpdateReadingGuideInput = inputObjectType({
  name: 'UpdateReadingGuideInput',
  definition(t) {
    t.id('readingGuideId', { required: true })
    // t.list.field('howIsSectionOrganized', { type: InformationStructureEnum })
    // t.string('whyWasSectionOrganized', { required: true })
    // t.string('majorIssue', { required: true })
    // t.boolean('majorIssueSolved', { required: true })
    // t.string('majorSolution', { required: true })
    // t.list.string('clarifyingQuestions', { required: true })
    t.list.string('problems', { required: true })
    t.string('biggestProblem', { required: true })
    t.string('reasonForBiggestProblem', { required: true })
    t.list.string('importantPeople', { required: true })
    t.string('howArePeopleInvolvedInProblems', { required: true })
    t.string('sectionConsequences', { required: true })
  },
})

export const UpdateReadingGuidePayload = objectType({
  name: 'UpdateReadingGuidePayload',
  definition(t) {
    t.field('readingGuide', { type: ReadingGuide })
  },
})

export const UpdateReadingGuide = mutationField('updateReadingGuide', {
  type: UpdateReadingGuidePayload,
  args: { input: arg({ type: UpdateReadingGuideInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        readingGuideId,
        // howIsSectionOrganized,
        // whyWasSectionOrganized,
        // majorIssue,
        // majorIssueSolved,
        // majorSolution,
        // clarifyingQuestions,

        problems,
        biggestProblem,
        reasonForBiggestProblem,
        importantPeople,
        howArePeopleInvolvedInProblems,
        sectionConsequences,
      },
    },
    { assignmentData }
  ) {
    const readingGuideValidation = await assignmentData.findOne({
      _id: new ObjectId(readingGuideId),
    })

    if (readingGuideValidation) {
      assignmentData.updateOne(
        {
          _id: new ObjectId(readingGuideId),
        },
        {
          $set: {
            'readingGuideFinal.problems': problems,
            'readingGuideFinal.biggestProblem': biggestProblem,
            'readingGuideFinal.reasonForBiggestProblem':
              reasonForBiggestProblem,
            'readingGuideFinal.importantPeople': importantPeople,
            'readingGuideFinal.howArePeopleInvolvedInProblems':
              howArePeopleInvolvedInProblems,
            'readingGuideFinal.sectionConsequences': sectionConsequences,
          },
        }
      )

      const readingGuide = await assignmentData.findOne({
        _id: new ObjectId(readingGuideId),
      })

      return { readingGuide }
    } else throw new Error('Reading Guide does not exist.')
  },
})
