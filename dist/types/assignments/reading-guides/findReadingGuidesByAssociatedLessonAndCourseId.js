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
exports.FindReadingGuidesByAssociatedLessonAndCourseId = exports.FindReadingGuidesByAssociatedLessonAndCourseIdPayload = exports.FindReadingGuidesByAssociatedLessonAndCourseIdInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FindReadingGuidesByAssociatedLessonAndCourseIdInput = schema_1.inputObjectType({
    name: 'FindReadingGuidesByAssociatedLessonAndCourseIdInput',
    definition(t) {
        t.id('lessonId', { required: true });
        t.id('courseId', { required: true });
    },
});
exports.FindReadingGuidesByAssociatedLessonAndCourseIdPayload = schema_1.objectType({
    name: 'FindReadingGuidesByAssociatedLessonAndCourseIdPayload',
    definition(t) {
        t.list.field('readingGuides', { type: _1.ReadingGuide });
    },
});
exports.FindReadingGuidesByAssociatedLessonAndCourseId = schema_1.queryField('findReadingGuidesByAssociatedLessonAndCourseId', {
    type: exports.FindReadingGuidesByAssociatedLessonAndCourseIdPayload,
    args: {
        input: schema_1.arg({
            type: exports.FindReadingGuidesByAssociatedLessonAndCourseIdInput,
            required: true,
        }),
    },
    resolve(_, { input: { lessonId, courseId } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const readingGuides = yield assignmentData
                .find({
                associatedLessonId: lessonId,
                'hasOwner.inCourses._id': new mongodb_1.ObjectId(courseId),
                articleTitle: { $exists: false },
                workingDraft: { $exists: false },
            })
                .toArray();
            return { readingGuides };
        });
    },
});
//# sourceMappingURL=findReadingGuidesByAssociatedLessonAndCourseId.js.map