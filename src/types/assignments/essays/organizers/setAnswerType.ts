import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay } from '..'
import { QuestionTypeEnum } from '../../../textSections/textSection'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../../teachers-aid-typegen'

export const SetAnswerTypeInput = inputObjectType({
  name: 'SetAnswerTypeInput',
  definition(t) {
    t.id('essayId', { required: true })
    t.field('questionType', { type: QuestionTypeEnum, required: true })
  },
})

export const SetAnswerTypePayload = objectType({
  name: 'SetAnswerTypePayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const SetAnswerType = mutationField('setAnswerType', {
  type: SetAnswerTypePayload,
  args: { input: arg({ type: SetAnswerTypeInput, required: true }) },
  async resolve(_, { input: { essayId, questionType } }, { assignmentData }) {
    const essay = await assignmentData.findOne({ _id: new ObjectId(essayId) })
    const problemSolution: NexusGenRootTypes['ProblemSolutionAnswerType'] = {
      problem: '',
      reasonForProblem: '',
      solvedBy: '',
      whySolutionSolved: '',
    }
    const howCauseEffect: NexusGenRootTypes['HowCauseEffectAnswerType'] = {
      before: '',
      cause: '',
      after: '',
    }
    const whyCauseEffect: NexusGenRootTypes['WhyCauseEffectAnswerType'] = {
      proximateCause: '',
      ultimateCause: '',
    }
    console.log(questionType)
    if (essay) {
      if (questionType === 'HOW_PROBLEM_SOLUTION') {
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId) },
          {
            $set: {
              'workingDraft.organizer.questionType': questionType,
              'workingDraft.organizer.answerType': problemSolution,
            },
          }
        )
      }
      if (questionType === 'HOW_CAUSE_EFFECT') {
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId) },
          {
            $set: {
              'workingDraft.organizer.questionType': questionType,
              'workingDraft.organizer.answerType': howCauseEffect,
            },
          }
        )
      }
      if (questionType === 'WHY_CAUSE_EFFECT') {
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId) },
          {
            $set: {
              'workingDraft.organizer.questionType': questionType,
              'workingDraft.organizer.answerType': whyCauseEffect,
            },
          }
        )
      }

      const essay = await assignmentData.findOne({ _id: new ObjectId(essayId) })
      return { essay }
    } else throw new Error('not finished')
  },
})
