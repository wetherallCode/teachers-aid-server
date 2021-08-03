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
exports.CreateTemporaryTasks = exports.CreateTemporaryTasksPayload = exports.CreateTemporaryTasksInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
const general_1 = require("../../general");
exports.CreateTemporaryTasksInput = schema_1.inputObjectType({
    name: 'CreateTemporaryTasksInput',
    definition(t) {
        t.string('dateIssued', { required: true });
        t.int('taskNumber', { required: true });
        t.id('courseId', { required: true });
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum, required: true });
    },
});
exports.CreateTemporaryTasksPayload = schema_1.objectType({
    name: 'CreateTemporaryTasksPayload',
    definition(t) {
        t.list.field('temporaryTasks', { type: _1.TemporaryTask });
    },
});
exports.CreateTemporaryTasks = schema_1.mutationField('createTemporaryTasks', {
    type: exports.CreateTemporaryTasksPayload,
    args: { input: schema_1.arg({ type: exports.CreateTemporaryTasksInput, required: true }) },
    resolve(_, { input: { dateIssued, taskNumber, courseId, markingPeriod } }, { temporaryTaskData, userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskCheck = yield temporaryTaskData
                .find({
                dateIssued,
                'student.inCourses._id': new mongodb_1.ObjectId(courseId),
                taskNumber,
            })
                .toArray();
            const duplicateTasks = taskCheck.length > 0;
            if (!duplicateTasks) {
                const temporaryTasks = [];
                const students = yield userData
                    .find({ 'inCourses._id': new mongodb_1.ObjectId(courseId) })
                    .toArray();
                for (const student of students) {
                    const newtemporaryTask = {
                        dateIssued,
                        answered: false,
                        studentPresent: true,
                        taskNumber,
                        student: student,
                        markingPeriod: markingPeriod,
                        lastGrade: 0,
                    };
                    const { insertedId } = yield temporaryTaskData.insertOne(newtemporaryTask);
                    newtemporaryTask._id = insertedId;
                    temporaryTasks.push(newtemporaryTask);
                }
                return { temporaryTasks };
            }
            else
                throw new Error('Tasks already created');
        });
    },
});
//# sourceMappingURL=createTemporaryTasks.js.map