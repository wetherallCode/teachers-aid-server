import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import {
  CourseInfo,
  CourseMaxSizeEnum,
  CourseTypeEnum,
  StudentSeatInput,
} from '.'
import { ObjectId } from 'mongodb'
import { NexusGenRootTypes } from '../../teachers-aid-typegen'
import { SchoolDayType } from '..'
import {
  twelveAssignedSeats,
  twentyFourAssignedSeats,
  thirtyAssignedSeats,
  thirtySixAssignedSeats,
  twelveCohortAssignedSeats,
  twentyFourCohortAssignedSeats,
  thirtyCohortAssignedSeats,
  thirtySixCohortAssignedSeats,
} from './intialAssignedSeats'

export const UpdateCourseInfoInput = inputObjectType({
  name: 'UpdateCourseInfoInput',
  definition(t) {
    t.id('courseId', { required: true })
    t.string('name', { required: true })
    t.string('startsAt')
    t.string('endsAt')
    t.string('halfDayStartsAt')
    t.string('halfDayEndsAt')
    t.boolean('cohortBasedSeating')
    t.field('courseType', { type: CourseTypeEnum })
    t.field('schoolDayType', { type: SchoolDayType })
    t.field('courseMaxSize', { type: CourseMaxSizeEnum, required: true })
  },
})

export const UpdateCourseInfoPayload = objectType({
  name: 'UpdateCourseInfoPayload',
  definition(t) {
    t.field('courseInfo', { type: CourseInfo })
  },
})

export const UpdateCourseInfo = mutationField('updateCourseInfo', {
  type: UpdateCourseInfoPayload,
  args: { input: arg({ type: UpdateCourseInfoInput, required: true }) },
  async resolve(
    _,
    {
      input: {
        courseId,
        name,
        startsAt,
        endsAt,
        halfDayStartsAt,
        halfDayEndsAt,
        courseType,
        schoolDayType,
        courseMaxSize,
        cohortBasedSeating,
      },
    },
    { courseData, userData }
  ) {
    const courseCheck: NexusGenRootTypes['Course'] = await courseData.findOne({
      _id: new ObjectId(courseId),
    })
    if (courseCheck) {
      if (name !== courseCheck.name)
        await courseData.updateOne(
          { _id: new ObjectId(courseId), name: { $exists: true } },
          {
            $set: {
              name,
            },
          }
        )
      await userData.updateOne(
        {
          teachesCourses_id: new ObjectId(courseId),
          name: { $exists: true },
          teachesCourses: { elemMatch: { _id: new ObjectId(courseId) } },
        },
        {
          $set: {
            'teachesCourses.$.name': name,
          },
        }
      )
      await courseData.updateOne(
        {
          _id: new ObjectId(courseId),
          startsAt: { $exists: true },
        },

        {
          $set: {
            startsAt,
            'course.name': name,
            endsAt,
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
                : courseMaxSize === 'TWENTY_FOUR' && cohortBasedSeating
                ? twentyFourCohortAssignedSeats
                : courseMaxSize === 'TWENTY_FOUR'
                ? twentyFourAssignedSeats
                : courseMaxSize === 'THIRTY' && cohortBasedSeating
                ? thirtyCohortAssignedSeats
                : courseMaxSize === 'THIRTY'
                ? thirtyAssignedSeats
                : courseMaxSize === 'THIRTY_SIX' && cohortBasedSeating
                ? thirtySixCohortAssignedSeats
                : thirtySixAssignedSeats,
          },
        }
      )
      const courseInfo = await courseData.updateOne({
        _id: new ObjectId(courseId),
        startsAt: { $exists: true },
      })

      return { courseInfo }
    } else throw new Error('Course does not exist.')
  },
})
