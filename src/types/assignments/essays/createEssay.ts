import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { Essay, ReadingsInput, TopicInput } from '.'
import { MarkingPeriodEnum, WritingLevelEnum, TimeOfDayEnum } from '../..'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'
import { getRandomInt } from '../../../utilities'

export const CreateEssayInput = inputObjectType({
  name: 'CreateEssayInput',
  definition(t) {
    t.list.field('topicList', { type: TopicInput, required: true })
    t.field('readings', { type: ReadingsInput, required: true })
    t.list.id('assignedCourseId', { required: true })
    t.id('associatedLessonId', { required: true })
    t.string('hasAssignerId', { required: true })
    t.int('maxPoints', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.string('dueDate', { required: true })
    t.field('dueTime', { type: TimeOfDayEnum, required: true })
    t.string('assignedDate', { required: true })
  },
})

export const TopicTypeInput = inputObjectType({
  name: 'TopicTypeInput',
  definition(t) {
    t.field('writingLevel', { type: WritingLevelEnum })
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
        topicList,
        readings,
        assignedCourseId,
        hasAssignerId,
        associatedLessonId,
        maxPoints,
        markingPeriod,
        dueDate,
        assignedDate,
        dueTime,
      },
    },
    { assignmentData, userData, studentData, courseData }
  ) {
    console.log(new Date().toISOString().substring(16, 23))

    const beginningValue = [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ]

    const assigner: NexusGenRootTypes['Teacher'] = await userData.findOne({
      _id: new ObjectId(hasAssignerId),
    })

    const studentList: NexusGenRootTypes['Student'][] = []

    for (const _id of assignedCourseId) {
      const students: NexusGenRootTypes['Student'][] = await userData
        .find({
          'inCourses._id': new ObjectId(_id),
        })
        .toArray()

      students.forEach((student: NexusGenRootTypes['Student']) => {
        studentList.push(student)
      })
    }

    const newEssays: NexusGenRootTypes['Essay'][] = []

    for (const student of studentList) {
      const essayCheck = await assignmentData.findOne({
        'hasOwner._id': student._id!,
        associatedLessonId,
        workingDraft: { $exists: true },
      })

      if (!essayCheck) {
        const studentCoursesIds = student.inCourses.map((course) => course._id)
        const teacherCoursesIds = assigner.teachesCourses.map(
          (course) => course._id
        )
        const courseList: string[] = []
        const studentCourses: any = []
        studentCoursesIds.forEach((id) => studentCourses.push(id?.toString()))
        teacherCoursesIds.forEach((id) => {
          if (studentCourses.includes(id?.toString())) {
            courseList.push(id!)
          }
        })
        const courseId = courseList[0]
        const assignedCourseInfo: NexusGenRootTypes['CourseInfo'] = await courseData.findOne(
          { 'course._id': courseId }
        )

        function assignedDueTime(time: string) {
          if (time === 'BEFORE_SCHOOL') {
            return '8:00:00 AM'
          }
          if (time === 'BEFORE_CLASS') {
            return assignedCourseInfo.startsAt
          }
          if (time === 'AFTER_CLASS') {
            return assignedCourseInfo.endsAt
          }
          if (time === 'AFTER_SCHOOL') {
            return '2:15:00 PM'
          }
          return '8:00:00 AM'
        }

        const dueTimeForAssignment = assignedDueTime(dueTime)

        const writingMetric: NexusGenRootTypes['WritingMetrics'] = await studentData.findOne(
          {
            'student._id': student._id,
            overallWritingMetric: { $exists: true },
          }
        )

        const individualTopic: NexusGenRootTypes['Topic'][] = topicList.filter(
          (topic: NexusGenRootTypes['Topic']) =>
            topic.writingLevel ===
            writingMetric.overallWritingMetric.overallWritingLevel
        )

        const newEssay: NexusGenRootTypes['Essay'] = {
          topic: individualTopic[getRandomInt(individualTopic.length)],
          assigned: false,
          dueTime: dueTimeForAssignment,
          assignedDate,
          associatedLessonId,
          dueDate,
          readings,
          leveledUp: false,
          paperBased: false,
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
    }

    console.log(new Date().toISOString().substring(16, 23))
    return { essays: newEssays }
  },
})
