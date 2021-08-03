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
exports.CreateReadingGuide = exports.CreateReadingGuidePayload = exports.CreateReadingGuideInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const __1 = require("../..");
const mongodb_1 = require("mongodb");
exports.CreateReadingGuideInput = schema_1.inputObjectType({
    name: 'CreateReadingGuideInput',
    definition(t) {
        t.field('readings', { type: 'ReadingsInput', required: true });
        t.list.id('assignedCourseIds', { required: true });
        t.id('associatedLessonId', { required: true });
        t.string('hasAssignerId', { required: true });
        t.int('maxPoints', { required: true });
        t.field('markingPeriod', { type: __1.MarkingPeriodEnum, required: true });
        t.string('dueDate', { required: true });
        t.field('dueTime', { type: __1.TimeOfDayEnum, required: true });
        t.string('assignedDate', { required: true });
    },
});
exports.CreateReadingGuidePayload = schema_1.objectType({
    name: 'CreateReadingGuidePayload',
    definition(t) {
        t.list.field('readingGuides', { type: _1.ReadingGuide });
    },
});
exports.CreateReadingGuide = schema_1.mutationField('createReadingGuide', {
    type: exports.CreateReadingGuidePayload,
    args: { input: schema_1.arg({ type: exports.CreateReadingGuideInput, required: true }) },
    resolve(_, { input: { readings, assignedCourseIds, associatedLessonId, hasAssignerId, maxPoints, markingPeriod, dueDate, dueTime, assignedDate, }, }, { assignmentData, userData, courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(new Date().toISOString().substring(18, 23));
            const assigner = yield userData.findOne({
                _id: new mongodb_1.ObjectId(hasAssignerId),
            });
            const studentList = [];
            for (const _id of assignedCourseIds) {
                const students = yield userData
                    .find({
                    'inCourses._id': new mongodb_1.ObjectId(_id),
                })
                    .toArray();
                students.forEach((student) => {
                    studentList.push(student);
                });
            }
            const newReadingGuides = [];
            for (const student of studentList) {
                const studentCoursesIds = student.inCourses.map((course) => course._id);
                const teacherCoursesIds = assigner.teachesCourses.map((course) => course._id);
                const courseList = [];
                const studentCourses = [];
                studentCoursesIds.forEach((id) => studentCourses.push(id === null || id === void 0 ? void 0 : id.toString()));
                teacherCoursesIds.forEach((id) => {
                    if (studentCourses.includes(id === null || id === void 0 ? void 0 : id.toString())) {
                        courseList.push(id);
                    }
                });
                const courseId = courseList[0];
                const assignedCourseInfo = yield courseData.findOne({ 'course._id': courseId });
                function assignedDueTime(time) {
                    if (time === 'BEFORE_SCHOOL') {
                        return '8:00:00 AM';
                    }
                    if (time === 'BEFORE_CLASS') {
                        return assignedCourseInfo.startsAt;
                    }
                    if (time === 'AFTER_CLASS') {
                        return assignedCourseInfo.endsAt;
                    }
                    if (time === 'AFTER_SCHOOL') {
                        return '2:15:00 PM';
                    }
                    return '8:00:00 AM';
                }
                const dueTimeForAssignment = assignedDueTime(dueTime);
                const newReadingGuide = {
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
                    hasOwner: yield userData.findOne({
                        _id: new mongodb_1.ObjectId(student._id),
                    }),
                    score: { earnedPoints: 0, maxPoints },
                    late: true,
                    exempt: false,
                };
                const { insertedId } = yield assignmentData.insertOne(newReadingGuide);
                newReadingGuide._id = insertedId;
                newReadingGuides.push(newReadingGuide);
            }
            console.log(new Date().toISOString().substring(18, 23));
            return { readingGuides: newReadingGuides };
        });
    },
});
//# sourceMappingURL=createReadingGuide.js.map