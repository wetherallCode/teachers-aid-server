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
exports.DeleteTemporaryTasks = exports.DeleteTemporaryTasksPayload = exports.DeleteTemporaryTasksInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
exports.DeleteTemporaryTasksInput = schema_1.inputObjectType({
    name: 'DeleteTemporaryTasksInput',
    definition(t) {
        t.string('dateIssued', { required: true });
        t.int('taskNumber', { required: true });
        t.id('courseId', { required: true });
    },
});
exports.DeleteTemporaryTasksPayload = schema_1.objectType({
    name: 'DeleteTemporaryTasksPayload',
    definition(t) {
        t.boolean('removed');
    },
});
exports.DeleteTemporaryTasks = schema_1.mutationField('deleteTemporaryTasks', {
    type: exports.DeleteTemporaryTasksPayload,
    args: { input: schema_1.arg({ type: exports.DeleteTemporaryTasksInput, required: true }) },
    resolve(_, { input: { dateIssued, taskNumber, courseId } }, { temporaryTaskData, studentData, generalData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const mp = yield generalData.findOne({
                currentMarkingPeriod: { $exists: true },
            });
            const taskCheck = yield temporaryTaskData
                .find({
                dateIssued,
                'student.inCourses._id': new mongodb_1.ObjectId(courseId),
                taskNumber,
            })
                .toArray();
            let removed = false;
            if (taskCheck.length > 0) {
                for (const task of taskCheck) {
                    if (task.answered) {
                        studentData.updateOne({
                            'student._id': new mongodb_1.ObjectId(task.student._id),
                            markingPeriod: mp.currentMarkingPeriod,
                            responsibilityPoints: { $exists: true },
                        }, {
                            $inc: { responsibilityPoints: -2 },
                        });
                    }
                }
                const { deletedCount } = yield temporaryTaskData.deleteMany({
                    dateIssued,
                    'student.inCourses._id': new mongodb_1.ObjectId(courseId),
                    taskNumber,
                });
                if (taskCheck.length === deletedCount) {
                    removed = true;
                }
                return { removed };
            }
            return { removed };
        });
    },
});
//# sourceMappingURL=deleteTemporaryTasks.js.map