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
exports.UpdateCourseInfo = exports.UpdateCourseInfoPayload = exports.UpdateCourseInfoInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
const __1 = require("..");
const intialAssignedSeats_1 = require("./intialAssignedSeats");
exports.UpdateCourseInfoInput = schema_1.inputObjectType({
    name: 'UpdateCourseInfoInput',
    definition(t) {
        t.id('courseId', { required: true });
        t.string('name', { required: true });
        t.string('startsAt');
        t.string('endsAt');
        t.string('halfDayStartsAt');
        t.string('halfDayEndsAt');
        t.boolean('cohortBasedSeating');
        t.field('courseType', { type: _1.CourseTypeEnum });
        t.field('schoolDayType', { type: __1.SchoolDayType });
        t.field('courseMaxSize', { type: _1.CourseMaxSizeEnum, required: true });
    },
});
exports.UpdateCourseInfoPayload = schema_1.objectType({
    name: 'UpdateCourseInfoPayload',
    definition(t) {
        t.field('courseInfo', { type: _1.CourseInfo });
    },
});
exports.UpdateCourseInfo = schema_1.mutationField('updateCourseInfo', {
    type: exports.UpdateCourseInfoPayload,
    args: { input: schema_1.arg({ type: exports.UpdateCourseInfoInput, required: true }) },
    resolve(_, { input: { courseId, name, startsAt, endsAt, halfDayStartsAt, halfDayEndsAt, courseType, schoolDayType, courseMaxSize, cohortBasedSeating, }, }, { courseData, userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseCheck = yield courseData.findOne({
                _id: new mongodb_1.ObjectId(courseId),
            });
            if (courseCheck) {
                if (name !== courseCheck.name)
                    yield courseData.updateOne({ _id: new mongodb_1.ObjectId(courseId), name: { $exists: true } }, {
                        $set: {
                            name,
                        },
                    });
                yield userData.updateOne({
                    teachesCourses_id: new mongodb_1.ObjectId(courseId),
                    name: { $exists: true },
                    teachesCourses: { elemMatch: { _id: new mongodb_1.ObjectId(courseId) } },
                }, {
                    $set: {
                        'teachesCourses.$.name': name,
                    },
                });
                yield courseData.updateOne({
                    _id: new mongodb_1.ObjectId(courseId),
                    startsAt: { $exists: true },
                }, {
                    $set: {
                        startsAt,
                        'course.name': name,
                        endsAt,
                        halfDayStartsAt,
                        halfDayEndsAt,
                        courseType,
                        schoolDayType,
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
                    },
                });
                const courseInfo = yield courseData.updateOne({
                    _id: new mongodb_1.ObjectId(courseId),
                    startsAt: { $exists: true },
                });
                return { courseInfo };
            }
            else
                throw new Error('Course does not exist.');
        });
    },
});
//# sourceMappingURL=updateCourseInfo.js.map