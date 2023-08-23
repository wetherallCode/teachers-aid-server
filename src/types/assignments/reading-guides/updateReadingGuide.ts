import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ReadingGuide, InformationStructureEnum } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const UpdateReadingGuideInput = inputObjectType({
  name: 'UpdateReadingGuideInput',
  definition(t) {
    t.id('readingGuideId', { required: true })

    // t.list.string('problems', { required: true })
    // t.string('biggestProblem', { required: true })
    // t.string('reasonForBiggestProblem', { required: true })
    // t.list.string('importantPeople', { required: true })
    // t.string('howArePeopleInvolvedInProblems', { required: true })
    // t.string('sectionConsequences', { required: true })
    t.string('questionType')
    t.string('answer')
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

        // problems,
        // biggestProblem,
        // reasonForBiggestProblem,
        // importantPeople,
        // howArePeopleInvolvedInProblems,
        // sectionConsequences,
        questionType,
        answer,
      },
    },
    { assignmentData }
  ) {
    const readingGuideValidation: NexusGenRootTypes['ReadingGuide'] =
      await assignmentData.findOne({
        _id: new ObjectId(readingGuideId),
      })
    console.log(questionType, answer)
    if (readingGuideValidation) {
      // assignmentData.updateOne(
      //   {
      //     _id: new ObjectId(readingGuideId),
      //   },
      //   {
      //     $set: {
      //       'readingGuideFinal.problems': problems,
      //       'readingGuideFinal.biggestProblem': biggestProblem,
      //       'readingGuideFinal.reasonForBiggestProblem':
      //         reasonForBiggestProblem,
      //       'readingGuideFinal.importantPeople': importantPeople,
      //       'readingGuideFinal.howArePeopleInvolvedInProblems':
      //         howArePeopleInvolvedInProblems,
      //       'readingGuideFinal.sectionConsequences': sectionConsequences,
      //     },
      //   }
      // )
      if (
        !readingGuideValidation.readingGuideFinal?.readingGuideQuestions?.find(
          (question) => question.questionType === questionType
        )
      ) {
        assignmentData.updateOne(
          { _id: new ObjectId(readingGuideId) },
          {
            $push: {
              'readingGuideFinal.readingGuideQuestions': {
                questionType,
                answer,
              },
            },
          }
        )
      } else {
        const { modifiedCount } = assignmentData.updateOne(
          {
            _id: new ObjectId(readingGuideId),
            'readingGuideFinal.readingGuideQuestions.questionType':
              questionType,
          },
          {
            $set: {
              'readingGuideFinal.readingGuideQuestions.$.answer': answer,
              // 'readingGuideFinal.$.questionType': questionType,
            },
          }
        )
        console.log(modifiedCount)
      }

      const readingGuide = await assignmentData.findOne({
        _id: new ObjectId(readingGuideId),
      })
      // console.log(readingGuide)
      return { readingGuide }
    } else throw new Error('Reading Guide does not exist.')
  },
})
