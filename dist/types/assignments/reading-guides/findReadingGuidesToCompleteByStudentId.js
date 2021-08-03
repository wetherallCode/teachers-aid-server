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
exports.FindReadingGuidesToCompleteByStudentId = exports.FindReadingGuidesToCompleteByStudentIdPayload = exports.FindReadingGuidesToCompleteByStudentIdInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.FindReadingGuidesToCompleteByStudentIdInput = schema_1.inputObjectType({
    name: 'FindReadingGuidesToCompleteByStudentIdInput',
    definition(t) {
        t.id('studentId', { required: true });
    },
});
exports.FindReadingGuidesToCompleteByStudentIdPayload = schema_1.objectType({
    name: 'FindReadingGuidesToCompleteByStudentIdPayload',
    definition(t) {
        t.list.field('readingGuides', { type: _1.ReadingGuide });
    },
});
exports.FindReadingGuidesToCompleteByStudentId = schema_1.queryField('findReadingGuidesToCompleteByStudentId', {
    type: exports.FindReadingGuidesToCompleteByStudentIdPayload,
    args: {
        input: schema_1.arg({
            type: exports.FindReadingGuidesToCompleteByStudentIdInput,
            required: true,
        }),
    },
    resolve(_, { input: { studentId } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const readingGuides = yield assignmentData
                .find({
                'hasOwner._id': new mongodb_1.ObjectId(studentId),
                assigned: true,
                articleTitle: { $exists: false },
                workingDraft: { $exists: false },
            })
                .toArray();
            return { readingGuides };
        });
    },
});
//# sourceMappingURL=findReadingGuidesToCompleteByStudentId.js.map