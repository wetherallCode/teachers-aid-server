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
exports.FindRubricEntries = exports.FindRubricEntriesPayload = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
exports.FindRubricEntriesPayload = schema_1.objectType({
    name: 'FindRubricEntriesPayload',
    definition(t) {
        t.list.field('rubricEntries', { type: _1.RubricEntry });
    },
});
exports.FindRubricEntries = schema_1.queryField('findRubricEntries', {
    type: exports.FindRubricEntriesPayload,
    resolve(_, __, { rubricData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const rubricEntries = yield rubricData
                .find({ rubricSection: { $exists: true } })
                .toArray();
            return { rubricEntries };
        });
    },
});
//# sourceMappingURL=findRubricEntries.js.map