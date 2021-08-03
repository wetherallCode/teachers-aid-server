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
exports.FindReadingGuidesByCourseIdAndAssignedDate = exports.FindReadingGuidesByCourseIdAndAssignedDatePayload = exports.FindReadingGuidesByCourseIdAndAssignedDateInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.FindReadingGuidesByCourseIdAndAssignedDateInput = schema_1.inputObjectType({
    name: 'FindReadingGuidesByCourseIdAndAssignedDateInput',
    definition(t) {
        t.id('courseId', { required: true });
        t.string('assignedDate');
    },
});
exports.FindReadingGuidesByCourseIdAndAssignedDatePayload = schema_1.objectType({
    name: 'FindReadingGuidesByCourseIdAndAssignedDatePayload',
    definition(t) {
        t.list.field('readingGuides', { type: _1.ReadingGuide });
    },
});
exports.FindReadingGuidesByCourseIdAndAssignedDate = schema_1.queryField('findReadingGuidesByCourseIdAndAssignedDate', {
    type: exports.FindReadingGuidesByCourseIdAndAssignedDatePayload,
    args: {
        input: schema_1.arg({
            type: exports.FindReadingGuidesByCourseIdAndAssignedDateInput,
            required: true,
        }),
    },
    resolve(_, { input: { courseId, assignedDate } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const readingGuides = yield assignmentData
                .find({
                'hasOwner.inCourses._id': new mongodb_1.ObjectId(courseId),
                assignedDate,
                workingDraft: { $exists: false },
                articleTitle: { $exists: false },
            })
                .toArray();
            return { readingGuides };
        });
    },
});
//# sourceMappingURL=findReadingGuidesByCourseIdAndAssignedDate.js.map