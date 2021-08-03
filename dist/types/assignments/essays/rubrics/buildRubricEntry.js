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
exports.BuildRubricEntry = exports.BuildRubricEntryPayload = exports.BuildRubricEntryInput = void 0;
const schema_1 = require("@nexus/schema");
const rubricEntry_1 = require("./rubricEntry");
const writingMetrics_1 = require("../../../students/progress-metrics/writingMetrics");
exports.BuildRubricEntryInput = schema_1.inputObjectType({
    name: 'BuildRubricEntryInput',
    definition(t) {
        t.string('entry', { required: true });
        t.int('score', { required: true });
        t.field('rubricSection', { type: rubricEntry_1.RubricSectionEnum, required: true });
        t.string('howToImprove');
        t.list.field('rubricWritingLevels', {
            type: writingMetrics_1.WritingLevelEnum,
            required: true,
        });
    },
});
exports.BuildRubricEntryPayload = schema_1.objectType({
    name: 'BuildRubricEntryPayload',
    definition(t) {
        t.field('rubricEntry', { type: rubricEntry_1.RubricEntry });
    },
});
exports.BuildRubricEntry = schema_1.mutationField('buildRubricEntry', {
    type: exports.BuildRubricEntryPayload,
    args: { input: schema_1.arg({ type: exports.BuildRubricEntryInput, required: true }) },
    resolve(_, { input: { entry, score, rubricSection, howToImprove, rubricWritingLevels }, }, { rubricData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const rubricEntry = {
                entry,
                score,
                rubricSection,
                howToImprove,
                rubricWritingLevels,
            };
            const { insertedId } = yield rubricData.insertOne(rubricEntry);
            rubricEntry._id = insertedId;
            return { rubricEntry };
        });
    },
});
//# sourceMappingURL=buildRubricEntry.js.map