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
exports.UpdateGradingDraft = exports.UpdateGradingDraftPayload = exports.UpdateGradingDraftInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.UpdateGradingDraftInput = schema_1.inputObjectType({
    name: 'UpdateGradingDraftInput',
    definition(t) {
        t.id('essayId', { required: true });
        t.JSON('gradingDraft');
        t.int('draftNumber');
    },
});
exports.UpdateGradingDraftPayload = schema_1.objectType({
    name: 'UpdateGradingDraftPayload',
    definition(t) {
        t.field('essay', { type: _1.Essay });
    },
});
exports.UpdateGradingDraft = schema_1.mutationField('updateGradingDraft', {
    type: exports.UpdateGradingDraftPayload,
    args: { input: schema_1.arg({ type: exports.UpdateGradingDraftInput, required: true }) },
    resolve(_, { input: { essayId, gradingDraft, draftNumber } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalDraftValidation = yield assignmentData.findOne({ _id: new mongodb_1.ObjectId(essayId), finalDraft: { $exists: true } });
            if (finalDraftValidation) {
                const { modifiedCount } = yield assignmentData.updateOne({
                    _id: new mongodb_1.ObjectId(essayId),
                    'finalDraft.submittedFinalDraft': {
                        $elemMatch: { draftNumber: draftNumber },
                    },
                }, {
                    $set: {
                        'finalDraft.submittedFinalDraft.$.gradingDraft': gradingDraft,
                    },
                });
                const essay = yield assignmentData.findOne({
                    _id: new mongodb_1.ObjectId(essayId),
                });
                return { essay };
            }
            else
                throw new Error('Essay has not been submitted.');
        });
    },
});
//# sourceMappingURL=updateGradingDraft.js.map