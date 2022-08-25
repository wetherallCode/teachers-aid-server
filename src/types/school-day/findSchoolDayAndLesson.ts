import { objectType, inputObjectType, arg, queryField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const FindSchoolDayAndLessonInput = inputObjectType({
  name: 'FindSchoolDayAndLessonInput',
  definition(t) {
    t.id('courseId', { required: true })
    t.string('todaysDate', { required: true })
  },
})

export const FindSchoolDayAndLessonPayload = objectType({
  name: 'FindSchoolDayAndLessonPayload',
  definition(t) {
    t.boolean('lessonToday')
  },
})

export const FindSchoolDayAndLesson = queryField('findSchoolDayAndLesson', {
  type: FindSchoolDayAndLessonPayload,
  args: { input: arg({ type: FindSchoolDayAndLessonInput, required: true }) },
  async resolve(
    _,
    { input: { courseId, todaysDate } },
    { schoolDayData, lessonData }
  ) {
    const findSchoolDay = await schoolDayData.findOne({ todaysDate })
    const lessonForToday = await lessonData.findOne({
      'assignedCourses._id': new ObjectId(courseId),
      assignedDate: todaysDate,
    })

    return { lessonToday: lessonForToday && findSchoolDay ? true : false }
  },
})
