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
exports.FindEssaysByAssociatedLessonIdAndCourseId = exports.FindEssaysByAssociatedLessonIdAndCourseIdPayload = exports.FindEssaysByAssociatedLessonIdAndCourseIdInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FindEssaysByAssociatedLessonIdAndCourseIdInput = schema_1.inputObjectType({
    name: 'FindEssaysByAssociatedLessonIdAndCourseIdInput',
    definition(t) {
        t.id('lessonId', { required: true });
        t.id('courseId', { required: true });
    },
});
exports.FindEssaysByAssociatedLessonIdAndCourseIdPayload = schema_1.objectType({
    name: 'FindEssaysByAssociatedLessonIdAndCourseIdPayload',
    definition(t) {
        t.list.field('essays', { type: _1.Essay });
    },
});
exports.FindEssaysByAssociatedLessonIdAndCourseId = schema_1.queryField('findEssaysByAssociatedLessonIdAndCourseId', {
    type: exports.FindEssaysByAssociatedLessonIdAndCourseIdPayload,
    args: {
        input: schema_1.arg({
            type: exports.FindEssaysByAssociatedLessonIdAndCourseIdInput,
            required: true,
        }),
    },
    resolve(_, { input: { lessonId, courseId } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essays = yield assignmentData
                .find({
                associatedLessonId: lessonId,
                'hasOwner.inCourses._id': new mongodb_1.ObjectId(courseId),
                workingDraft: { $exists: true },
            })
                .toArray();
            return { essays };
        });
    },
});
//# sourceMappingURL=findEssaysByAssociatedLessonIdAndCourseId.js.map