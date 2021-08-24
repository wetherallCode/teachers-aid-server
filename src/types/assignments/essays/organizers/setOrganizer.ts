import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay } from '..'
import { WritingLevelEnum } from '../../../students/progress-metrics/writingMetrics'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../../teachers-aid-typegen'

export const SetOrganizerInput = inputObjectType({
  name: 'SetOrganizerInput',
  definition(t) {
    t.id('essayId', { required: true })
    t.field('writingLevel', { type: WritingLevelEnum, required: true })
  },
})

export const SetOrganizerPayload = objectType({
  name: 'SetOrganizerPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const SetOrganizer = mutationField('setOrganizer', {
  type: SetOrganizerPayload,
  args: { input: arg({ type: SetOrganizerInput, required: true }) },
  async resolve(_, { input: { essayId, writingLevel } }, { assignmentData }) {
    const organizerCheck: NexusGenRootTypes['Essay'] =
      await assignmentData.findOne({
        _id: new ObjectId(essayId!),
      })
    if (!organizerCheck.workingDraft.organizer) {
      if (writingLevel === 'DEVELOPING') {
        console.log('developing')
        const developingOrganizer: NexusGenRootTypes['DevelopingOrganizer'] = {
          developingSentenceStructure: {
            subject: '',
            verb: '',
            object: '',
            subjectCompliment: '',
          },
          restatement: '',
          answer: '',
          conclusion: '',
          // organizerType: 'DEVELOPING',
        }
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId) },
          {
            $set: { 'workingDraft.organizer': developingOrganizer },
          }
        )
        const essay: NexusGenRootTypes['Essay'] = await assignmentData.findOne({
          _id: new ObjectId(essayId),
        })
        console.log(essay.workingDraft.organizer)
        return { essay }
      }
      if (writingLevel === 'ACADEMIC') {
        const academicOrganizer: NexusGenRootTypes['AcademicOrganizer'] = {
          academicSentenceStructure: {
            subject: '',
            verb: '',
            object: '',
            subjectCompliment: '',
          },
          restatement: '',
          conclusion: '',
          // organizerType: 'ACADEMIC',
        }
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId!) },
          {
            $set: { 'workingDraft.organizer': academicOrganizer },
          }
        )
        const essay = await assignmentData.findOne({
          _id: new ObjectId(essayId),
        })
        return { essay }
      }
      if (writingLevel === 'ADVANCED') {
        const advancedOrganizer: NexusGenRootTypes['AdvancedOrganizer'] = {
          advancedSentenceStructure: {
            subject: '',
            verb: '',
            object: '',
            subjectCompliment: '',
          },
          // organizerType: 'ADVANCED',
          restatement: '',
          conclusion: '',
        }
        await assignmentData.updateOne(
          { _id: new ObjectId(essayId!) },
          {
            $set: { 'workingDraft.organizer': advancedOrganizer },
          }
        )
        const essay = await assignmentData.findOne({
          _id: new ObjectId(essayId),
        })
        return { essay }
      } else throw new Error('You need an appropriate writing level')
    } else throw new Error('Organizer already added')
  },
})
