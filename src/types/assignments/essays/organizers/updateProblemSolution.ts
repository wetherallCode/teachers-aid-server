import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay } from '..'
import {
  NexusGenRootTypes,
  NexusGenFieldTypes,
} from '../../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const UpdateProblemSolutionInput = inputObjectType({
  name: 'UpdateProblemSolutionInput',
  definition(t) {
    t.id('essayId', { required: true })
    t.string('problem', { required: true })
    t.string('reasonForProblem', { required: true })
    t.string('solvedBy', { required: true })
    t.string('whySolutionSolved', { required: true })
  },
})

export const UpdateProblemSolutionPayload = objectType({
  name: 'UpdateProblemSolutionPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const UpdateProblemSolution = mutationField('updateProblemSolution', {
  type: UpdateProblemSolutionPayload,
  args: { input: arg({ type: UpdateProblemSolutionInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        essayId,
        problem,
        reasonForProblem,
        solvedBy,
        whySolutionSolved,
      },
    },
    { assignmentData }
  ) {
    const questionTypeCheck: NexusGenRootTypes['Essay'] = await assignmentData.findOne(
      { _id: new ObjectId(essayId) }
    )

    const { questionType } = questionTypeCheck.workingDraft
      .organizer! as NexusGenFieldTypes['AcademicOrganizer']

    if (
      questionTypeCheck.workingDraft.organizer!.hasOwnProperty('questionType')
    ) {
      if (questionType === 'HOW_PROBLEM_SOLUTION') {
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId) },
          {
            $set: {
              'workingDraft.organizer.answerType.problem': problem,
              'workingDraft.organizer.answerType.reasonForProblem': reasonForProblem,
              'workingDraft.organizer.answerType.solvedBy': solvedBy,
              'workingDraft.organizer.answerType.whySolutionSolved': whySolutionSolved,
            },
          }
        )

        const essay = await assignmentData.findOne({
          _id: new ObjectId(essayId),
        })
        return { essay }
      } else throw new Error('Wrong answerType')
    } else throw new Error('There is not question type selected')
  },
})
