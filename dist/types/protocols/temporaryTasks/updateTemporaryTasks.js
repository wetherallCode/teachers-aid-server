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
exports.UpdateTemporaryTasks = exports.UpdateTemporaryTasksPayload = exports.UpdateTemporaryTasksInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.UpdateTemporaryTasksInput = schema_1.inputObjectType({
    name: 'UpdateTemporaryTasksInput',
    definition(t) {
        t.string('dateIssued', { required: true });
        t.int('taskNumber', { required: true });
        t.id('courseId', { required: true });
        t.string('newDateIssued');
        t.int('newTaskNumber');
    },
});
exports.UpdateTemporaryTasksPayload = schema_1.objectType({
    name: 'UpdateTemporaryTasksPayload',
    definition(t) {
        t.list.field('temporaryTasks', { type: _1.TemporaryTask });
    },
});
exports.UpdateTemporaryTasks = schema_1.mutationField('updateTemporaryTasks', {
    type: exports.UpdateTemporaryTasksPayload,
    args: { input: schema_1.arg({ type: exports.UpdateTemporaryTasksInput, required: true }) },
    resolve(_, { input: { dateIssued, taskNumber, courseId, newDateIssued, newTaskNumber }, }, { temporaryTaskData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskCheck = yield temporaryTaskData
                .find({
                dateIssued,
                'student.inCourses._id': new mongodb_1.ObjectId(courseId),
                taskNumber,
            })
                .toArray();
            if (taskCheck) {
                if (newDateIssued) {
                    temporaryTaskData.updateMany({
                        dateIssued,
                        'student.inCourses._id': new mongodb_1.ObjectId(courseId),
                        taskNumber,
                    }, {
                        $set: {
                            dateIssued: newDateIssued,
                        },
                    });
                    const temporaryTasks = yield temporaryTaskData
                        .find({
                        dateIssued: newDateIssued,
                        'student.inCourses._id': new mongodb_1.ObjectId(courseId),
                        taskNumber,
                    })
                        .toArray();
                    return { temporaryTasks: temporaryTasks };
                }
                if (newTaskNumber) {
                    temporaryTaskData.updateMany({
                        dateIssued,
                        'student.inCourses._id': new mongodb_1.ObjectId(courseId),
                        taskNumber,
                    }, {
                        $set: {
                            taskNumber: newTaskNumber,
                        },
                    });
                    const temporaryTasks = yield temporaryTaskData
                        .find({
                        dateIssued,
                        'student.inCourses._id': new mongodb_1.ObjectId(courseId),
                        taskNumber: newTaskNumber,
                    })
                        .toArray();
                    return { temporaryTasks: temporaryTasks };
                }
                return { temporaryTasks: taskCheck };
            }
            else
                throw new Error('Tasks have not been created');
        });
    },
});
//# sourceMappingURL=updateTemporaryTasks.js.map