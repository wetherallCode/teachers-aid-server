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
exports.SetAnswerType = exports.SetAnswerTypePayload = exports.SetAnswerTypeInput = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const textSection_1 = require("../../../textSections/textSection");
const mongodb_1 = require("mongodb");
exports.SetAnswerTypeInput = schema_1.inputObjectType({
    name: 'SetAnswerTypeInput',
    definition(t) {
        t.id('essayId', { required: true });
        t.field('questionType', { type: textSection_1.QuestionTypeEnum, required: true });
    },
});
exports.SetAnswerTypePayload = schema_1.objectType({
    name: 'SetAnswerTypePayload',
    definition(t) {
        t.field('essay', { type: __1.Essay });
    },
});
exports.SetAnswerType = schema_1.mutationField('setAnswerType', {
    type: exports.SetAnswerTypePayload,
    args: { input: schema_1.arg({ type: exports.SetAnswerTypeInput, required: true }) },
    resolve(_, { input: { essayId, questionType } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essay = yield assignmentData.findOne({ _id: new mongodb_1.ObjectId(essayId) });
            const problemSolution = {
                problem: '',
                reasonForProblem: '',
                solvedBy: '',
                whySolutionSolved: '',
            };
            const howCauseEffect = {
                before: '',
                cause: '',
                after: '',
            };
            const whyCauseEffect = {
                proximateCause: '',
                ultimateCause: '',
            };
            if (essay) {
                if (questionType === 'HOW_PROBLEM_SOLUTION') {
                    yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(essayId) }, {
                        $set: {
                            'workingDraft.organizer.questionType': questionType,
                            'workingDraft.organizer.answerType': problemSolution,
                        },
                    });
                }
                if (questionType === 'HOW_CAUSE_EFFECT') {
                    yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(essayId) }, {
                        $set: {
                            'workingDraft.organizer.questionType': questionType,
                            'workingDraft.organizer.answerType': howCauseEffect,
                        },
                    });
                }
                if (questionType === 'WHY_CAUSE_EFFECT') {
                    yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(essayId) }, {
                        $set: {
                            'workingDraft.organizer.questionType': questionType,
                            'workingDraft.organizer.answerType': whyCauseEffect,
                        },
                    });
                }
                const essay = yield assignmentData.findOne({ _id: new mongodb_1.ObjectId(essayId) });
                return { essay };
            }
            else
                throw new Error('not finished');
        });
    },
});
//# sourceMappingURL=setAnswerType.js.map