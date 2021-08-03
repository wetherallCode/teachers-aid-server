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
exports.UpdateLessonProtocol = exports.UpdateLessonProtocolPayload = exports.UpdateLessonProtocolInput = void 0;
const schema_1 = require("@nexus/schema");
const lessons_1 = require("../lessons");
const mongodb_1 = require("mongodb");
exports.UpdateLessonProtocolInput = schema_1.inputObjectType({
    name: 'UpdateLessonProtocolInput',
    definition(t) {
        t.id('lessonId', { required: true });
        t.string('task', { required: true });
        t.boolean('isActive', { required: true });
        t.date('assignedDate', { required: true });
        t.list.id('studentIds', { required: true });
    },
});
exports.UpdateLessonProtocolPayload = schema_1.objectType({
    name: 'UpdateProtocolPayload',
    definition(t) {
        t.field('lesson', { type: lessons_1.Lesson });
        t.list.field('protocols', { type: lessons_1.Protocol });
    },
});
exports.UpdateLessonProtocol = schema_1.mutationField('updateLessonProtocol', {
    type: exports.UpdateLessonProtocolPayload,
    args: { input: schema_1.arg({ type: exports.UpdateLessonProtocolInput, required: true }) },
    resolve(_, { input: { lessonId, task, isActive, assignedDate, studentIds } }, { lessonData, protocolData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonCheck = yield lessonData.findOne({
                _id: new mongodb_1.ObjectId(lessonId),
            });
            if (lessonCheck) {
                const protocols = [];
                for (const studentId of studentIds) {
                    yield protocolData.updateOne({
                        'student._id': new mongodb_1.ObjectId(studentId),
                        assignedDate,
                        task,
                    }, {
                        $set: {
                            isActive: isActive,
                        },
                    });
                    const protocol = yield protocolData.findOne({
                        'student._id': new mongodb_1.ObjectId(studentId),
                        assignedDate,
                        task,
                    });
                    protocols.push(protocol);
                }
                yield lessonData.updateOne({
                    _id: new mongodb_1.ObjectId(lessonId),
                    duringActivities: { $elemMatch: { task } },
                }, {
                    $set: {
                        'duringActivities.$.isActive': isActive,
                    },
                });
                return {
                    lesson: yield lessonData.findOne({
                        _id: new mongodb_1.ObjectId(lessonId),
                    }),
                    protocols,
                };
            }
            else
                throw new Error('Lesson does not exist.');
        });
    },
});
//# sourceMappingURL=updateLessonProtocol.js.map