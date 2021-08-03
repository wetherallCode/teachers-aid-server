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
exports.CreateEssay = exports.CreateEssayPayload = exports.TopicTypeInput = exports.CreateEssayInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const __1 = require("../..");
const mongodb_1 = require("mongodb");
const utilities_1 = require("../../../utilities");
exports.CreateEssayInput = schema_1.inputObjectType({
    name: 'CreateEssayInput',
    definition(t) {
        t.list.field('topicList', { type: _1.TopicInput, required: true });
        t.field('readings', { type: _1.ReadingsInput, required: true });
        t.list.id('assignedCourseId', { required: true });
        t.id('associatedLessonId', { required: true });
        t.string('hasAssignerId', { required: true });
        t.int('maxPoints', { required: true });
        t.field('markingPeriod', { type: __1.MarkingPeriodEnum, required: true });
        t.string('dueDate', { required: true });
        t.field('dueTime', { type: __1.TimeOfDayEnum, required: true });
        t.string('assignedDate', { required: true });
    },
});
exports.TopicTypeInput = schema_1.inputObjectType({
    name: 'TopicTypeInput',
    definition(t) {
        t.field('writingLevel', { type: __1.WritingLevelEnum });
    },
});
exports.CreateEssayPayload = schema_1.objectType({
    name: 'CreateEssayPayload',
    definition(t) {
        t.list.field('essays', { type: _1.Essay });
    },
});
exports.CreateEssay = schema_1.mutationField('createEssay', {
    type: exports.CreateEssayPayload,
    args: { input: schema_1.arg({ type: exports.CreateEssayInput, required: true }) },
    resolve(_, { input: { topicList, readings, assignedCourseId, hasAssignerId, associatedLessonId, maxPoints, markingPeriod, dueDate, assignedDate, dueTime, }, }, { assignmentData, userData, studentData, courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(new Date().toISOString().substring(17, 23));
            const beginningValue = [
                {
                    type: 'paragraph',
                    children: [{ text: '' }],
                },
            ];
            const assigner = yield userData.findOne({
                _id: new mongodb_1.ObjectId(hasAssignerId),
            });
            const studentList = [];
            for (const _id of assignedCourseId) {
                const students = yield userData
                    .find({
                    'inCourses._id': new mongodb_1.ObjectId(_id),
                })
                    .toArray();
                students.forEach((student) => {
                    studentList.push(student);
                });
            }
            const newEssays = [];
            for (const student of studentList) {
                const essayCheck = yield assignmentData.findOne({
                    'hasOwner._id': student._id,
                    associatedLessonId,
                    workingDraft: { $exists: true },
                });
                if (!essayCheck) {
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
                    const writingMetric = yield studentData.findOne({
                        'student._id': student._id,
                        overallWritingMetric: { $exists: true },
                    });
                    const individualTopic = topicList.filter((topic) => topic.writingLevel ===
                        writingMetric.overallWritingMetric.overallWritingLevel);
                    const newEssay = {
                        topic: individualTopic[utilities_1.getRandomInt(individualTopic.length)],
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
                        hasOwner: yield userData.findOne({
                            _id: new mongodb_1.ObjectId(student._id),
                        }),
                        score: { earnedPoints: 0, maxPoints },
                        late: true,
                        exempt: false,
                    };
                    const { insertedId } = yield assignmentData.insertOne(newEssay);
                    newEssay._id = insertedId;
                    newEssays.push(newEssay);
                }
            }
            console.log(new Date().toISOString().substring(17, 23));
            return { essays: newEssays };
        });
    },
});
//# sourceMappingURL=createEssay.js.map