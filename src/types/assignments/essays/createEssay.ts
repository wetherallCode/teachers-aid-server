import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay, ReadingsInput, TopicInput } from '.'
import { MarkingPeriodEnum } from '../..'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const CreateEssayInput = inputObjectType({
  name: 'CreateEssayInput',
  definition(t) {
    t.field('topic', { type: TopicInput, required: true })
    t.field('readings', { type: ReadingsInput, required: true })
    t.list.id('assignedCourseId', { required: true })
    t.id('associatedLessonId', { required: true })
    // t.list.string('hasOwner', { required: true })
    t.string('hasAssignerId', { required: true })
    t.int('maxPoints', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.date('dueDate', { required: true })
    t.date('assignedDate', { required: true })
  },
})

export const CreateEssayPayload = objectType({
  name: 'CreateEssayPayload',
  definition(t) {
    t.list.field('essays', { type: Essay })
  },
})

export const CreateEssay = mutationField('createEssay', {
  type: CreateEssayPayload,
  args: { input: arg({ type: CreateEssayInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        topic,
        readings,
        assignedCourseId,
        hasAssignerId,
        associatedLessonId,
        maxPoints,
        markingPeriod,
        dueDate,
        assignedDate,
      },
    },
    { assignmentData, userData }
  ) {
    console.log(new Date().toISOString())
    const beginningValue = [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ]

    const assigner = await userData.findOne({
      _id: new ObjectId(hasAssignerId),
    })

    const studentList: NexusGenRootTypes['Student'][] = []
    const newEssays: NexusGenRootTypes['Essay'][] = []

    for (const _id of assignedCourseId) {
      const students = await userData
        .find({
          'inCourses._id': new ObjectId(_id),
        })
        .toArray()
      students.forEach((student: NexusGenRootTypes['Student']) => {
        studentList.push(student)
      })
    }

    for (const student of studentList) {
      const newEssay: NexusGenRootTypes['Essay'] = {
        topic,
        assigned: false,
        assignedDate,
        associatedLessonId,
        dueDate,
        readings,
        workingDraft: {
          draft: JSON.stringify(beginningValue),
        },
        markingPeriod,
        hasAssigner: assigner,
        hasOwner: await userData.findOne({
          _id: new ObjectId(student._id!),
        }),
        score: { earnedPoints: 0, maxPoints },
        late: true,
        exempt: false,
      }
      const { insertedId } = await assignmentData.insertOne(newEssay)
      newEssay._id = insertedId
      newEssays.push(newEssay)
    }
    console.log(new Date().toISOString())
    return { essays: newEssays }
  },
})
