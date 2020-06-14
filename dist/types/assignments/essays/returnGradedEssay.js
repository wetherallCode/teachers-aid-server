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
const mongodb_1 = require("mongodb");
exports.ReturnGradedEssayInput = schema_1.inputObjectType({
    name: 'ReturnGradedEssayInput',
    definition(t) {
        t.id('_id', { required: true });
        t.JSON('gradedDraft', { required: true });
        t.list.string('comments', { required: true });
        t.int('score', { required: true });
    },
});
exports.ReturnGradedEssayPayload = schema_1.objectType({
    name: 'ReturnGradedEssayPayload',
    definition(t) {
        t.field('essay', { type: _1.Essay });
    },
});
exports.ReturnGradedEssay = schema_1.mutationField('returnGradedEssay', {
    type: exports.ReturnGradedEssayPayload,
    args: { input: schema_1.arg({ type: exports.ReturnGradedEssayInput, required: true }) },
    resolve(_, { input: { _id, gradedDraft, comments, score } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essay = yield assignmentData.findOne({ _id: new mongodb_1.ObjectID(_id) });
            const currentScore = essay.score.earnedPoints;
            if (currentScore < score) {
                yield assignmentData.updateOne({ _id: new mongodb_1.ObjectID(_id) }, {
                    $set: {
                        'score.earnedPoints': score,
                    },
                });
            }
            yield assignmentData.updateOne({ _id: new mongodb_1.ObjectID(_id) }, {
                $set: {
                    'finalDraft.submittedFinalDraft': {
                        draft: gradedDraft,
                        comments,
                        score,
                    },
                    'finalDraft.returned': true,
                    'finalDraft.submitted': false,
                },
            });
            const returnedEssay = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectID(_id),
            });
            return { essay: returnedEssay };
        });
    },
});
//# sourceMappingURL=returnGradedEssay.js.map