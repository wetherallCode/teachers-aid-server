import {
  objectType,
  inputObjectType,
  arg,
  mutationField,
  enumType,
} from '@nexus/schema'
import { SchoolDayType } from '../general/school-day-tracking/schoolDayType'
import { CourseInfo, CourseTypeEnum } from '.'
import { NexusGenRootTypes } from 'teachers-aid-server/src/teachers-aid-typegen'
import { ObjectId } from 'mongodb'
import {
  twelveAssignedSeats,
  twentyFourAssignedSeats,
  thirtyAssignedSeats,
  thirtySixAssignedSeats,
  twelveCohortAssignedSeats,
} from './intialAssignedSeats'

export const CreateCourseInfoInput = inputObjectType({
  name: 'CreateCourseInfoInput',
  definition(t) {
    t.id('courseId', { required: true })
    t.string('startsAt', { required: true })
    t.string('endsAt', { required: true })
    t.string('halfDayStartsAt', { required: true })
    t.string('halfDayEndsAt', { required: true })
    // t.id('teacherId')
    t.boolean('cohortBasedSeating', { required: true })
    t.field('courseType', { type: CourseTypeEnum, required: true })
    t.field('schoolDayType', { type: SchoolDayType, required: true })
    t.field('courseMaxSize', { type: CourseMaxSizeEnum, required: true })
  },
})
export const CourseMaxSizeEnum = enumType({
  name: 'CourseMaxSizeEnum',
  members: ['TWELVE', 'TWENTY_FOUR', 'THIRTY', 'THIRTY_SIX'],
})

export const CreateCourseInfoPayload = objectType({
  name: 'CreateCourseInfoPayload',
  definition(t) {
    t.field('courseInfo', { type: CourseInfo })
  },
})

export const CreateCourseInfo = mutationField('createCourseInfo', {
  type: CreateCourseInfoPayload,
  args: { input: arg({ type: CreateCourseInfoInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        courseId,
        startsAt,
        endsAt,
        halfDayStartsAt,
        halfDayEndsAt,
        schoolDayType,
        cohortBasedSeating,
        courseType,
        courseMaxSize,
      },
    },
    { courseData, userData }
  ) {
    const course = await courseData.findOne({ _id: new ObjectId(courseId) })
    const coursesTeacher: NexusGenRootTypes['Teacher'] = await userData.findOne(
      {
        'teachesCourses._id': new ObjectId(courseId),
      }
    )
    courseMaxSize
    if (course) {
      const courseInfo: NexusGenRootTypes['CourseInfo'] = {
        course,
        startsAt,
        endsAt,
        hasTeacher: coursesTeacher,
        halfDayStartsAt,
        halfDayEndsAt,
        courseType,
        schoolDayType,
        cohortBasedSeating,
        assignedSeats:
          courseMaxSize === 'TWELVE' && cohortBasedSeating
            ? twelveCohortAssignedSeats
            : courseMaxSize === 'TWELVE'
            ? twelveAssignedSeats
            : courseMaxSize === 'TWENTY_FOUR'
            ? twentyFourAssignedSeats
            : courseMaxSize === 'THIRTY'
            ? thirtyAssignedSeats
            : thirtySixAssignedSeats,
      }

      const { insertedId } = await courseData.insertOne(courseInfo)
      courseInfo._id = insertedId

      return { courseInfo }
    } else throw new Error('This Course does not exist')
  },
})
