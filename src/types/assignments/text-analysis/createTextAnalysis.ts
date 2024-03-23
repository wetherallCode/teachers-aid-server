import { arg, inputObjectType, mutationField, objectType } from '@nexus/schema'
import { MarkingPeriodEnum } from '../../general'
import { ReadingsInput } from '../essays'
import { TextAnalysis } from './textAnalysis'
import { NexusGenRootTypes } from '../../../teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const CreateTextAnalysisInput = inputObjectType({
  name: 'CreateTextAnalysisInput',
  definition(t) {
    t.field('readings', { type: ReadingsInput, required: true })
    t.list.id('assignedCourseIds', { required: true })
    t.id('associatedLessonId', { required: true })
    t.string('hasAssignerId', { required: true })
    t.int('maxPoints', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.string('dueDate', { required: true })
    t.string('assignedDate', { required: true })
  },
})

export const CreateTextAnalysisPayload = objectType({
  name: 'CreateTextAnalysisPayload',
  definition(t) {
    t.list.field('textAnalyses', { type: TextAnalysis })
  },
})

export const CreateTextAnalysis = mutationField('createTextAnalysis', {
  type: CreateTextAnalysisPayload,
  args: { input: arg({ type: CreateTextAnalysisInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        readings,
        assignedCourseIds,
        associatedLessonId,
        hasAssignerId,
        maxPoints,
        markingPeriod,
        dueDate,
        assignedDate,
      },
    },
    { assignmentData, userData, courseData },
  ) {
    const assigner: NexusGenRootTypes['Teacher'] = await userData.findOne({
      _id: new ObjectId(hasAssignerId),
    })

    const studentList: NexusGenRootTypes['Student'][] = []

    for (const _id of assignedCourseIds) {
      const students: NexusGenRootTypes['Student'][] = await userData
        .find({
          'inCourses._id': new ObjectId(_id),
        })
        .toArray()

      students.forEach((student: NexusGenRootTypes['Student']) => {
        studentList.push(student)
      })
    }

    const textAnalyses: NexusGenRootTypes['TextAnalysis'][] = []

    for (const student of studentList) {
      const studentCoursesIds = student.inCourses.map((course: NexusGenRootTypes['Course']) => course._id)
      const teacherCoursesIds = assigner.teachesCourses.map(
        (course) => course._id,
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
      const assignedCourseInfo: NexusGenRootTypes['CourseInfo'] =
        await courseData.findOne({ 'course._id': courseId })

      const newTextAnalysis: NexusGenRootTypes['TextAnalysis'] = {
        finishedEssentialQuestion: false,
        startedPromptly: false,
        workedWellWithGroup: false,
        assigned: false,
        assignedDate,
        associatedLessonId,
        textAnalysisCompletion: 'PARTIAL_COMPLETION',
        dueDate,
        dueTime: assignedCourseInfo.endsAt,
        exempt: false,
        paperBased: true,
        missing: true,
        markingPeriod,
        gradeType: 'SECONDARY',
        hasAssigner: assigner,
        hasOwner: await userData.findOne({
          _id: new ObjectId(student._id!),
        }),
        score: { earnedPoints: 0, maxPoints },
        late: false,
        readings,
      }
      const { insertedId } = await assignmentData.insertOne(newTextAnalysis)
      newTextAnalysis._id = insertedId
      textAnalyses.push(newTextAnalysis)
    }
    return { textAnalyses }
  },
})
