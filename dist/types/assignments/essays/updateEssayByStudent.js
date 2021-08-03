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
exports.UpdateEssayByStudent = exports.UpdateEssayByStudentPayload = exports.UpdateEssayByStudentInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
const essays_1 = require("./essays");
exports.UpdateEssayByStudentInput = schema_1.inputObjectType({
    name: 'UpdateEssayByStudentInput',
    definition(t) {
        t.id('studentId', { required: true });
        t.string('section', { required: true });
        t.field('topic', { type: essays_1.TopicInput });
        t.date('dueDate', { required: true });
    },
});
exports.UpdateEssayByStudentPayload = schema_1.objectType({
    name: 'UpdateEssayByStudentPayload',
    definition(t) {
        t.field('essay', { type: _1.Essay });
    },
});
exports.UpdateEssayByStudent = schema_1.mutationField('updateEssayByStudent', {
    type: exports.UpdateEssayByStudentPayload,
    description: 'To change an individual students topic question information or dueDate',
    args: { input: schema_1.arg({ type: exports.UpdateEssayByStudentInput, required: true }) },
    resolve(_, { input: { studentId, section, topic, dueDate } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essayValidation = yield assignmentData.findOne({
                'hasOwner._id': new mongodb_1.ObjectId(studentId),
                'readings.readingSections': section,
                workingDraft: { $exists: true },
            });
            if (essayValidation) {
                yield assignmentData.updateOne({
                    'hasOwner._id': new mongodb_1.ObjectId(studentId),
                    'readings.readingSections': section,
                }, {
                    $set: {
                        topic,
                        dueDate,
                        'workingDraft.draft': JSON.stringify([
                            {
                                type: 'paragraph',
                                children: [{ text: '' }],
                            },
                        ]),
                    },
                });
                const essay = yield assignmentData.findOne({
                    'hasOwner._id': new mongodb_1.ObjectId(studentId),
                    'readings.readingSections': section,
                });
                return { essay };
            }
            else
                throw new Error('Essay not found');
        });
    },
});
//# sourceMappingURL=updateEssayByStudent.js.map