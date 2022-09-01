import { objectType, inputObjectType, arg, mutationField } from '@nexus/schema'
import { ObjectId } from 'mongodb'

export const ModifyCourseInfoPayload = objectType({
  name: 'ModifyCourseInfoPayload',
  definition(t) {
    t.boolean('modified')
  },
})

export const ModifyCourseInfo = mutationField('modifyCourseInfo', {
  type: ModifyCourseInfoPayload,
  // args: { input: arg({ type: ModifyCourseInfoInput, required: true }) },
  async resolve(_, __, { courseData }) {
    const course = await courseData.findOne({
      _id: new ObjectId('61326f9bfea6ec23e4989c8c'),
    })
    await courseData.updateMany(
      { 'course._id': new ObjectId('613269a4fea6ec23e4989c82') },
      {
        $set: {
          assignedSeats: [
            { deskNumber: 1, student: null },
            { deskNumber: 2, student: null },
            { deskNumber: 3, student: null },
            { deskNumber: 4, student: null },
            { deskNumber: 5, student: null },
            { deskNumber: 6, student: null },
            { deskNumber: 7, student: null },
            { deskNumber: 8, student: null },
            { deskNumber: 9, student: null },
            { deskNumber: 10, student: null },
            { deskNumber: 11, student: null },
            { deskNumber: 12, student: null },
            { deskNumber: 13, student: null },
            { deskNumber: 14, student: null },
            { deskNumber: 15, student: null },
            { deskNumber: 16, student: null },
            { deskNumber: 17, student: null },
            { deskNumber: 18, student: null },
            { deskNumber: 19, student: null },
            { deskNumber: 20, student: null },
            { deskNumber: 21, student: null },
            { deskNumber: 22, student: null },
            { deskNumber: 23, student: null },
            { deskNumber: 24, student: null },
            { deskNumber: 25, student: null },
            { deskNumber: 26, student: null },
            { deskNumber: 27, student: null },
            { deskNumber: 28, student: null },
            { deskNumber: 29, student: null },
            { deskNumber: 30, student: null },
          ],
        },
      }
    )
    // console.log(course)
    return { modified: true }
  },
})
