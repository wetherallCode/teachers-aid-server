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
exports.UpdateProblemSolution = exports.UpdateProblemSolutionPayload = exports.UpdateProblemSolutionInput = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const mongodb_1 = require("mongodb");
exports.UpdateProblemSolutionInput = schema_1.inputObjectType({
    name: 'UpdateProblemSolutionInput',
    definition(t) {
        t.id('essayId', { required: true });
        t.string('problem', { required: true });
        t.string('reasonForProblem', { required: true });
        t.string('solvedBy', { required: true });
        t.string('whySolutionSolved', { required: true });
    },
});
exports.UpdateProblemSolutionPayload = schema_1.objectType({
    name: 'UpdateProblemSolutionPayload',
    definition(t) {
        t.field('essay', { type: __1.Essay });
    },
});
exports.UpdateProblemSolution = schema_1.mutationField('updateProblemSolution', {
    type: exports.UpdateProblemSolutionPayload,
    args: { input: schema_1.arg({ type: exports.UpdateProblemSolutionInput, required: true }) },
    resolve(_, { input: { essayId, problem, reasonForProblem, solvedBy, whySolutionSolved, }, }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const questionTypeCheck = yield assignmentData.findOne({ _id: new mongodb_1.ObjectId(essayId) });
            const { questionType } = questionTypeCheck.workingDraft
                .organizer;
            if (questionTypeCheck.workingDraft.organizer.hasOwnProperty('questionType')) {
                if (questionType === 'HOW_PROBLEM_SOLUTION') {
                    yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(essayId) }, {
                        $set: {
                            'workingDraft.organizer.answerType.problem': problem,
                            'workingDraft.organizer.answerType.reasonForProblem': reasonForProblem,
                            'workingDraft.organizer.answerType.solvedBy': solvedBy,
                            'workingDraft.organizer.answerType.whySolutionSolved': whySolutionSolved,
                        },
                    });
                    const essay = yield assignmentData.findOne({
                        _id: new mongodb_1.ObjectId(essayId),
                    });
                    return { essay };
                }
                else
                    throw new Error('Wrong answerType');
            }
            else
                throw new Error('There is not question type selected');
        });
    },
});
//# sourceMappingURL=updateProblemSolution.js.map