import { inputObjectType, objectType, mutationField, arg } from '@nexus/schema'
import { Essay } from '.'
import { MarkingPeriodEnum } from '../../general'
import { NexusGenRootTypes } from 'teachers-aid-server/src/practice-api-typegen'
import { QuestionTypeEnum } from './essays'

export const AssignEssayInput = inputObjectType({
  name: 'AssignEssayInput',
  definition(t) {
    t.field('topic', { type: TopicInput, required: true })
    t.field('readings', { type: ReadingsInput, required: true })
    t.string('assignedCourse', { required: true })
    t.string('hasAssigner', { required: true })
    t.int('maxPoints', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.date('dueDate', { required: true })
  },
})

export const TopicInput = inputObjectType({
  name: 'TopicInput',
  definition(t) {
    t.string('question', { required: true })
    t.field('questionType', { type: QuestionTypeEnum, required: true })
  },
})

export const AssignEssayPayload = objectType({
  name: 'AssignEssayPayload',
  definition(t) {
    t.list.field('essay', { type: Essay })
  },
})

export const ReadingsInput = inputObjectType({
  name: 'ReadingsInput',
  definition(t) {
    t.string('readingPages', { required: true })
    t.string('readingSections', { required: true })
  },
})

export const AssignEssay = mutationField('assignEssay', {
  type: AssignEssayPayload,
  args: { input: arg({ type: AssignEssayInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        topic,
        readings,
        assignedCourse,
        hasAssigner,
        maxPoints,
        markingPeriod,
        dueDate,
      },
    },
    { assignmentData, courseData, userData }
  ) {
    console.log(new Date().toISOString())
    const course = (await courseData.findOne({
      period: assignedCourse,
    })) as NexusGenRootTypes['Course']

    const students = course.hasStudents.map((student) => student.userName)

    const newEssays = []

    const beginningValue = [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ]

    for (const student in students) {
      const newEssay: NexusGenRootTypes['Essay'] = {
        topic,
        assignedDate: new Date().toLocaleDateString(),
        dueDate,
        readings,
        workingDraft: {
          draft: JSON.stringify(beginningValue),
        },
        markingPeriod,
        hasAssigner: await userData.findOne({ userName: hasAssigner }),
        hasOwner: await userData.findOne({
          userName: students[student],
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
    return { essay: newEssays }
  },
})
