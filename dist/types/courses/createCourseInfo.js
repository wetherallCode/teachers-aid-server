"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCourseInfo = exports.CreateCourseInfoPayload = exports.CourseMaxSizeEnum = exports.CreateCourseInfoInput = void 0;
const schema_1 = require("@nexus/schema");
const schoolDayType_1 = require("../school-day/schoolDayType");
const _1 = require(".");
const mongodb_1 = require("mongodb");
const intialAssignedSeats_1 = require("./intialAssignedSeats");
exports.CreateCourseInfoInput = schema_1.inputObjectType({
    name: 'CreateCourseInfoInput',
    definition(t) {
        t.id('courseId', { required: true });
        t.string('startsAt', { required: true });
        t.string('endsAt', { required: true });
        t.string('halfDayStartsAt', { required: true });
        t.string('halfDayEndsAt', { required: true });
        t.boolean('cohortBasedSeating', { required: true });
        t.field('courseType', { type: _1.CourseTypeEnum, required: true });
        t.field('schoolDayType', { type: schoolDayType_1.SchoolDayType, required: true });
        t.field('courseMaxSize', { type: exports.CourseMaxSizeEnum, required: true });
    },
});
exports.CourseMaxSizeEnum = schema_1.enumType({
    name: 'CourseMaxSizeEnum',
    members: ['TWELVE', 'TWENTY_FOUR', 'THIRTY', 'THIRTY_SIX'],
});
exports.CreateCourseInfoPayload = schema_1.objectType({
    name: 'CreateCourseInfoPayload',
    definition(t) {
        t.field('courseInfo', { type: _1.CourseInfo });
    },
});
exports.CreateCourseInfo = schema_1.mutationField('createCourseInfo', {
    type: exports.CreateCourseInfoPayload,
    args: { input: schema_1.arg({ type: exports.CreateCourseInfoInput, required: true }) },
    resolve(_, { input: { courseId, startsAt, endsAt, halfDayStartsAt, halfDayEndsAt, schoolDayType, cohortBasedSeating, courseType, courseMaxSize, }, }, { courseData, userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseData.findOne({
                _id: new mongodb_1.ObjectId(courseId),
            });
            const coursesTeacher = yield userData.findOne({
                'teachesCourses._id': new mongodb_1.ObjectId(courseId),
            });
            if (course) {
                const courseInfo = {
                    course,
                    startsAt,
                    endsAt,
                    hasTeacher: coursesTeacher,
                    halfDayStartsAt,
                    halfDayEndsAt,
                    courseType,
                    schoolDayType,
                    associatedCourseId: course._id,
                    cohortBasedSeating,
                    assignedSeats: courseMaxSize === 'TWELVE' && cohortBasedSeating
                        ? intialAssignedSeats_1.twelveCohortAssignedSeats
                        : courseMaxSize === 'TWELVE'
                            ? intialAssignedSeats_1.twelveAssignedSeats
                            : courseMaxSize === 'TWENTY_FOUR' && cohortBasedSeating
                                ? intialAssignedSeats_1.twentyFourCohortAssignedSeats
                                : courseMaxSize === 'TWENTY_FOUR'
                                    ? intialAssignedSeats_1.twentyFourAssignedSeats
                                    : courseMaxSize === 'THIRTY' && cohortBasedSeating
                                        ? intialAssignedSeats_1.thirtyCohortAssignedSeats
                                        : courseMaxSize === 'THIRTY'
                                            ? intialAssignedSeats_1.thirtyAssignedSeats
                                            : courseMaxSize === 'THIRTY_SIX' && cohortBasedSeating
                                                ? intialAssignedSeats_1.thirtySixCohortAssignedSeats
                                                : intialAssignedSeats_1.thirtySixAssignedSeats,
                };
                const { insertedId } = yield courseData.insertOne(courseInfo);
                courseInfo._id = insertedId;
                return { courseInfo };
            }
            else
                throw new Error('This Course does not exist');
        });
    },
});
//# sourceMappingURL=createCourseInfo.js.map