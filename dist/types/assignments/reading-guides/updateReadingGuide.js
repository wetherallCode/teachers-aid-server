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
exports.UpdateReadingGuide = exports.UpdateReadingGuidePayload = exports.UpdateReadingGuideInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.UpdateReadingGuideInput = schema_1.inputObjectType({
    name: 'UpdateReadingGuideInput',
    definition(t) {
        t.id('readingGuideId', { required: true });
        t.list.field('howIsSectionOrganized', { type: _1.InformationStructureEnum });
        t.string('whyWasSectionOrganized', { required: true });
        t.string('majorIssue', { required: true });
        t.boolean('majorIssueSolved', { required: true });
        t.string('majorSolution', { required: true });
        t.list.string('clarifyingQuestions', { required: true });
    },
});
exports.UpdateReadingGuidePayload = schema_1.objectType({
    name: 'UpdateReadingGuidePayload',
    definition(t) {
        t.field('readingGuide', { type: _1.ReadingGuide });
    },
});
exports.UpdateReadingGuide = schema_1.mutationField('updateReadingGuide', {
    type: exports.UpdateReadingGuidePayload,
    args: { input: schema_1.arg({ type: exports.UpdateReadingGuideInput, required: true }) },
    resolve(_, { input: { readingGuideId, howIsSectionOrganized, whyWasSectionOrganized, majorIssue, majorIssueSolved, majorSolution, clarifyingQuestions, }, }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const readingGuideValidation = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectId(readingGuideId),
            });
            if (readingGuideValidation) {
                assignmentData.updateOne({
                    _id: new mongodb_1.ObjectId(readingGuideId),
                }, {
                    $set: {
                        'readingGuideFinal.howIsSectionOrganized': howIsSectionOrganized,
                        'readingGuideFinal.whyWasSectionOrganized': whyWasSectionOrganized,
                        'readingGuideFinal.majorIssue': majorIssue,
                        'readingGuideFinal.majorIssueSolved': majorIssueSolved,
                        'readingGuideFinal.majorSolution': majorSolution,
                        'readingGuideFinal.clarifyingQuestions': clarifyingQuestions,
                    },
                });
                const readingGuide = yield assignmentData.findOne({
                    _id: new mongodb_1.ObjectId(readingGuideId),
                });
                return { readingGuide };
            }
            else
                throw new Error('Reading Guide does not exist.');
        });
    },
});
//# sourceMappingURL=updateReadingGuide.js.map