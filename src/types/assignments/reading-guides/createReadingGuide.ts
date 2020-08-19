import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ReadingGuide } from '.'
import { MarkingPeriodEnum, TimeOfDayEnum } from '../..'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'

export const CreateReadingGuideInput = inputObjectType({
  name: 'CreateReadingGuideInput',
  definition(t) {
    t.field('readings', { type: 'ReadingsInput', required: true })
    t.list.id('assignedCourseIds', { required: true })
    t.id('associatedLessonId', { required: true })
    t.string('hasAssignerId', { required: true })
    t.int('maxPoints', { required: true })
    t.field('markingPeriod', { type: MarkingPeriodEnum, required: true })
    t.date('dueDate', { required: true })
    t.field('dueTime', { type: TimeOfDayEnum, required: true })
    t.date('assignedDate', { required: true })
  },
})

export const CreateReadingGuidePayload = objectType({
  name: 'CreateReadingGuidePayload',
  definition(t) {
    t.list.field('readingGuides', { type: ReadingGuide })
  },
})

export const CreateReadingGuide = mutationField('createReadingGuide', {
  type: CreateReadingGuidePayload,
  args: { input: arg({ type: CreateReadingGuideInput, required: true }) },
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
        dueTime,
        assignedDate,
      },
    },
    { assignmentData, userData, courseData }
  ) {
    console.log(new Date().toISOString().substring(18, 23))
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

    const newReadingGuides: NexusGenRootTypes['ReadingGuide'][] = []

    for (const student of studentList) {
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
          return '08:00:00 AM'
        }
        if (time === 'BEFORE_CLASS') {
          return assignedCourseInfo.startsAt
        }
        if (time === 'AFTER_CLASS') {
          return assignedCourseInfo.endsAt
        }
        if (time === 'AFTER_SCHOOL') {
          return '02:15:00 PM'
        }
        return '08:00:00 AM'
      }

      const dueTimeForAssignment = assignedDueTime(dueTime)

      const newReadingGuide: NexusGenRootTypes['ReadingGuide'] = {
        assigned: false,
        assignedDate,
        associatedLessonId,
        completed: false,
        graded: false,
        dueDate,
        dueTime: dueTimeForAssignment,
        readings,
        paperBased: false,
        markingPeriod,
        hasAssigner: assigner,
        hasOwner: await userData.findOne({
          _id: new ObjectId(student._id!),
        }),
        score: { earnedPoints: 0, maxPoints },
        late: true,
        exempt: false,
      }
      const { insertedId } = await assignmentData.insertOne(newReadingGuide)
      newReadingGuide._id = insertedId

      newReadingGuides.push(newReadingGuide)
    }
    console.log(new Date().toISOString().substring(18, 23))
    return { readingGuides: newReadingGuides }
  },
})
