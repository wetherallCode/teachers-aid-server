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
exports.ResubmitEssayFinalDraft = exports.ResubmitEssayFinalDraftPayload = exports.ResubmitEssayFinalDraftInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.ResubmitEssayFinalDraftInput = schema_1.inputObjectType({
    name: 'ResubmitEssayFinalDraftInput',
    definition(t) {
        t.id('essayId', { required: true });
        t.field('submittedFinalDraft', {
            type: _1.SubmittedFinalDraftsInput,
            required: true,
        });
    },
});
exports.ResubmitEssayFinalDraftPayload = schema_1.objectType({
    name: 'ResubmitEssayFinalDraftPayload',
    definition(t) {
        t.field('essay', { type: _1.Essay });
    },
});
exports.ResubmitEssayFinalDraft = schema_1.mutationField('resubmitEssayFinalDraft', {
    type: exports.ResubmitEssayFinalDraftPayload,
    args: {
        input: schema_1.arg({ type: exports.ResubmitEssayFinalDraftInput, required: true }),
    },
    resolve(_, { input: { essayId, submittedFinalDraft } }, { assignmentData }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const essayCheck = yield assignmentData.findOne({ _id: new mongodb_1.ObjectId(essayId), finalDraft: { $exists: true } });
            const beginningValue = [
                {
                    type: 'paragraph',
                    children: [{ text: '' }],
                },
            ];
            const lastSubmissionGraded = (_a = essayCheck.finalDraft) === null || _a === void 0 ? void 0 : _a.submittedFinalDraft[essayCheck.finalDraft.submittedFinalDraft.length - 1].graded;
            const alreadyGraded = ((_b = essayCheck.finalDraft) === null || _b === void 0 ? void 0 : _b.submitted) === true;
            if (essayCheck) {
                yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(essayId) }, {
                    $set: {
                        assigned: false,
                        'workingDraft.draft': JSON.stringify(beginningValue),
                        'finalDraft.submitted': true,
                        'finalDraft.returned': false,
                    },
                });
                yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(essayId) }, {
                    $push: { 'finalDraft.submittedFinalDraft': submittedFinalDraft },
                });
                const submittedEssay = yield assignmentData.findOne({
                    _id: new mongodb_1.ObjectId(essayId),
                });
                return { essay: submittedEssay };
            }
            else
                throw new Error('Essay has not been submitted yet.');
        });
    },
});
//# sourceMappingURL=resubmitEssayFinalDraft.js.map