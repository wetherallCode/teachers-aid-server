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
exports.FindRubricEntriesByCategory = exports.FindRubricEntriesByCategoryPayload = exports.FindRubricEntriesByCategoryInput = void 0;
const schema_1 = require("@nexus/schema");
const writingMetrics_1 = require("../../../students/progress-metrics/writingMetrics");
const _1 = require(".");
exports.FindRubricEntriesByCategoryInput = schema_1.inputObjectType({
    name: 'FindRubricEntriesByCategoryInput',
    definition(t) {
        t.field('rubricWritingLevel', { type: writingMetrics_1.WritingLevelEnum, required: true });
    },
});
exports.FindRubricEntriesByCategoryPayload = schema_1.objectType({
    name: 'FindRubricEntriesByCategoryPayload',
    definition(t) {
        t.list.field('rubricEntries', { type: _1.RubricEntry });
    },
});
exports.FindRubricEntriesByCategory = schema_1.queryField('findRubricEntriesByCategory', {
    type: exports.FindRubricEntriesByCategoryPayload,
    args: {
        input: schema_1.arg({ type: exports.FindRubricEntriesByCategoryInput, required: true }),
    },
    resolve(_, { input: { rubricWritingLevel } }, { rubricData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const rubricEntries = yield rubricData
                .find({ rubricWritingLevels: rubricWritingLevel })
                .toArray();
            return { rubricEntries };
        });
    },
});
//# sourceMappingURL=findRubricEntriesByCategory.js.map