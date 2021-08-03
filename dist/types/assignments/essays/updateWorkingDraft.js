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
exports.UpdateWorkingDraft = exports.UpdateWorkingDraftPayload = exports.UpdateWorkingDraftInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.UpdateWorkingDraftInput = schema_1.inputObjectType({
    name: 'UpdateWorkingDraftInput',
    definition(t) {
        t.id('_id', { required: true });
        t.JSON('updatedDraft', { required: true });
    },
});
exports.UpdateWorkingDraftPayload = schema_1.objectType({
    name: 'UpdateWorkingDraftPayload',
    definition(t) {
        t.field('essay', { type: _1.Essay });
    },
});
exports.UpdateWorkingDraft = schema_1.mutationField('updateWorkingDraft', {
    type: exports.UpdateWorkingDraftPayload,
    args: { input: schema_1.arg({ type: exports.UpdateWorkingDraftInput, required: true }) },
    resolve(_, { input: { _id, updatedDraft } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield assignmentData.updateOne({ _id: new mongodb_1.ObjectID(_id) }, { $set: { 'workingDraft.draft': updatedDraft } });
            const updatedDraftDocument = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectID(_id),
            });
            return { essay: updatedDraftDocument };
        });
    },
});
//# sourceMappingURL=updateWorkingDraft.js.map