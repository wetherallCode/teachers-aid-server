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
exports.SubmitEssayFinalDraftInput = schema_1.inputObjectType({
    name: 'SubmitEssayFinalDraftInput',
    definition(t) {
        t.id('_id', { required: true });
        t.field('submittedFinalDraft', {
            type: _1.SubmittedFinalDraftsInput,
            required: true,
        });
        t.boolean('late', { required: true });
    },
});
exports.SubmitEssayFinalDraftPayload = schema_1.objectType({
    name: 'SubmitEssayFinalDraftPayload',
    definition(t) {
        t.field('essay', { type: _1.Essay });
    },
});
exports.SubmitEssayFinalDraft = schema_1.mutationField('submitEssayFinalDraft', {
    type: exports.SubmitEssayFinalDraftPayload,
    args: { input: schema_1.arg({ type: exports.SubmitEssayFinalDraftInput, required: true }) },
    resolve(_, { input: { _id, submittedFinalDraft, late } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const submittedEssay = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectId(_id),
            });
            yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(_id) }, {
                $set: {
                    late,
                    finalDraft: {
                        submittedFinalDraft,
                        submitted: true,
                        returned: false,
                        submitTime: new Date().toLocaleString(),
                    },
                },
            });
            return { essay: submittedEssay };
        });
    },
});
//# sourceMappingURL=submitEssayFinalDraft.js.map