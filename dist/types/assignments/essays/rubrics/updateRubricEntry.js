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
exports.UpdateRubricEntry = exports.UpdateRubricEntryPayload = exports.UpdateRubricEntryInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const writingMetrics_1 = require("../../../students/progress-metrics/writingMetrics");
const mongodb_1 = require("mongodb");
exports.UpdateRubricEntryInput = schema_1.inputObjectType({
    name: 'UpdateRubricEntryInput',
    definition(t) {
        t.id('rubricEntryId', { required: true });
        t.string('entry', { required: true });
        t.int('score', { required: true });
        t.field('rubricSection', { type: _1.RubricSectionEnum, required: true });
        t.string('howToImprove');
        t.list.field('rubricWritingLevels', {
            type: writingMetrics_1.WritingLevelEnum,
            required: true,
        });
    },
});
exports.UpdateRubricEntryPayload = schema_1.objectType({
    name: 'UpdateRubricEntryPayload',
    definition(t) {
        t.field('rubricEntry', { type: _1.RubricEntry });
    },
});
exports.UpdateRubricEntry = schema_1.mutationField('updateRubricEntry', {
    type: exports.UpdateRubricEntryPayload,
    args: { input: schema_1.arg({ type: exports.UpdateRubricEntryInput, required: true }) },
    resolve(_, { input: { rubricEntryId, entry, score, rubricSection, rubricWritingLevels, howToImprove, }, }, { rubricData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const entryCheck = yield rubricData.findOne({
                _id: new mongodb_1.ObjectId(rubricEntryId),
            });
            if (entryCheck) {
                yield rubricData.updateOne({ _id: new mongodb_1.ObjectId(rubricEntryId) }, {
                    $set: {
                        entry,
                        score,
                        rubricSection,
                        rubricWritingLevels,
                        howToImprove,
                    },
                });
            }
            else
                throw new Error('This Rubric Entry does not exist');
            const rubricEntry = yield rubricData.findOne({
                _id: new mongodb_1.ObjectId(rubricEntryId),
            });
            return { rubricEntry };
        });
    },
});
//# sourceMappingURL=updateRubricEntry.js.map