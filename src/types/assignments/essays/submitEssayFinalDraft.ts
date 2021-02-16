import { inputObjectType, objectType, mutationField, arg } from '@nexus/schema'
import { SubmittedFinalDraftsInput, Essay } from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'

export const SubmitEssayFinalDraftInput = inputObjectType({
  name: 'SubmitEssayFinalDraftInput',
  definition(t) {
    t.id('_id', { required: true })
    t.field('submittedFinalDraft', {
      type: SubmittedFinalDraftsInput,
      required: true,
    })
    t.boolean('late', { required: true })
    t.boolean('paperBased', { required: true })
  },
})

export const SubmitEssayFinalDraftPayload = objectType({
  name: 'SubmitEssayFinalDraftPayload',
  definition(t) {
    t.field('essay', { type: Essay })
  },
})

export const SubmitEssayFinalDraft = mutationField('submitEssayFinalDraft', {
  type: SubmitEssayFinalDraftPayload,
  args: { input: arg({ type: SubmitEssayFinalDraftInput, required: true }) },
  async resolve(
    _,
    { input: { _id, submittedFinalDraft, late, paperBased } },
    { assignmentData, studentData, generalData }
  ) {
    const essayCheck: NexusGenRootTypes['Essay'] = await assignmentData.findOne(
      { _id: new ObjectId(_id) }
    )
    const beginningValue = [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ]
    const currentMarkingPeriod: NexusGenRootTypes['MarkingPeriod'] = await generalData.findOne(
      { currentMarkingPeriod: { $exists: true } }
    )

    // Determine if essay is late
    function handleLate() {
      const submittedDate: string = new Date().toLocaleDateString()
      const submittedTime: string = new Date().toLocaleString().substring(10)

      let isLate: boolean = false

      if (submittedDate > essayCheck.dueDate) {
        isLate = true
      }
      if (
        essayCheck.dueDate === submittedDate &&
        essayCheck.dueTime < submittedTime
      ) {
        isLate = true
      }
      return isLate
    }

    function handleLateness() {
      const submittedDateTime: string = new Date().toLocaleString()
      const dueDateTime: string = `${essayCheck.dueDate}, ${essayCheck.dueTime}`

      if (Date.parse(submittedDateTime) > Date.parse(dueDateTime)) {
        return true
      } else return false
    }

    if (paperBased === true) {
      if (essayCheck) {
        await assignmentData.updateOne(
          { _id: new ObjectId(_id) },
          {
            $set: {
              late: late,
              assigned: false,
              paperBased,
              'finalDraft.submitted': true,
              'finalDraft.returned': false,
              'finalDraft.submitTime': new Date().toLocaleString(),
            },
          }
        )

        await assignmentData.updateOne(
          { _id: new ObjectId(_id) },
          {
            $push: { 'finalDraft.submittedFinalDraft': submittedFinalDraft },
          }
        )

        await studentData.updateOne(
          {
            'student._id': new ObjectId(essayCheck.hasOwner._id!),
            markingPeriod: currentMarkingPeriod.currentMarkingPeriod,
            responsibilityPoints: { $exists: true },
          },
          {
            $inc: { responsibilityPoints: handleLateness() ? 4 : 7 },
          }
        )

        const submittedEssay = await assignmentData.findOne({
          _id: new ObjectId(_id),
        })
        return { essay: submittedEssay }
      }
    }

    if (essayCheck) {
      await assignmentData.updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: {
            late: handleLateness(),
            assigned: false,
            paperBased,
            'workingDraft.draft': JSON.stringify(beginningValue),
            'finalDraft.submitted': true,
            'finalDraft.returned': false,
            'finalDraft.submitTime': new Date().toLocaleString(),
          },
        }
      )
      if (!essayCheck.finalDraft)
        await assignmentData.updateOne(
          { _id: new ObjectId(_id) },
          {
            $push: { 'finalDraft.submittedFinalDraft': submittedFinalDraft },
          }
        )

      await studentData.updateOne(
        {
          'student._id': new ObjectId(essayCheck.hasOwner._id!),
          markingPeriod: currentMarkingPeriod.currentMarkingPeriod,
          responsibilityPoints: { $exists: true },
        },
        {
          $inc: { responsibilityPoints: handleLateness() ? 4 : 7 },
        }
      )

      const submittedEssay = await assignmentData.findOne({
        _id: new ObjectId(_id),
      })
      return { essay: submittedEssay }
    } else throw new Error('Essay does not exist')
  },
})
