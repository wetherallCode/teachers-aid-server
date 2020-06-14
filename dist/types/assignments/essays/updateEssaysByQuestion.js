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
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const textSections_1 = require("../../textSections");
const mongodb_1 = require("mongodb");
const students_1 = require("../../students");
exports.UpdateEssaysByQuestionInput = schema_1.inputObjectType({
    name: 'UpdateEssaysByQuestionInput',
    definition(t) {
        t.string('originalQuestion', { required: true });
        t.string('newQuestion', { required: true });
        t.field('newQuestionType', { type: textSections_1.QuestionTypeEnum, required: true });
        t.field('newWritingLevel', { type: students_1.WritingLevelType, required: true });
    },
});
exports.UpdateEssaysByQuestionPayload = schema_1.objectType({
    name: 'UpdateEssaysByQuestionPayload',
    definition(t) {
        t.list.field('essays', { type: _1.Essay });
    },
});
exports.UpdateEssaysByQuestion = schema_1.mutationField('updateEssaysByQuestion', {
    type: exports.UpdateEssaysByQuestionPayload,
    args: { input: schema_1.arg({ type: exports.UpdateEssaysByQuestionInput, required: true }) },
    resolve(_, { input: { originalQuestion, newQuestion, newQuestionType, newWritingLevel, }, }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essayValidation = yield assignmentData
                .find({ 'topic.question': originalQuestion })
                .toArray();
            const essayIds = essayValidation.map((essay) => essay._id);
            if (essayValidation.length > 0) {
                const updatedEssays = [];
                yield assignmentData.updateMany({ 'topic.question': originalQuestion }, {
                    $set: {
                        'topic.question': newQuestion,
                        'topic.questionType': newQuestionType,
                        'topic.writingLevel': newWritingLevel,
                    },
                });
                for (const _id of essayIds) {
                    const essay = yield assignmentData.findOne({ _id: new mongodb_1.ObjectId(_id) });
                    updatedEssays.push(essay);
                }
                return { essays: updatedEssays };
            }
            else
                throw new Error('No essays for this Question');
        });
    },
});
//# sourceMappingURL=updateEssaysByQuestion.js.map