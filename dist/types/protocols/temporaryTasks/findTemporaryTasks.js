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
exports.FindTemporaryTasks = exports.FindTemporaryTasksPayload = exports.FindTemporaryTasksInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.FindTemporaryTasksInput = schema_1.inputObjectType({
    name: 'FindTemporaryTasksInput',
    definition(t) {
        t.string('dateIssued', { required: true });
        t.id('courseId', { required: true });
    },
});
exports.FindTemporaryTasksPayload = schema_1.objectType({
    name: 'FindTemporaryTasksPayload',
    definition(t) {
        t.list.field('temporaryTasks', { type: _1.TemporaryTask });
    },
});
exports.FindTemporaryTasks = schema_1.queryField('findTemporaryTasks', {
    type: exports.FindTemporaryTasksPayload,
    args: { input: schema_1.arg({ type: exports.FindTemporaryTasksInput, required: true }) },
    resolve(_, { input: { dateIssued, courseId } }, { temporaryTaskData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const temporaryTaskCheck = yield temporaryTaskData
                .find({
                dateIssued,
                'student.inCourses._id': new mongodb_1.ObjectId(courseId),
            })
                .toArray();
            return { temporaryTasks: temporaryTaskCheck };
        });
    },
});
//# sourceMappingURL=findTemporaryTasks.js.map