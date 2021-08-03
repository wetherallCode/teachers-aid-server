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
exports.FindLessonByCourse = exports.FindLessonByCoursePayload = exports.FindLessonByCourseInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FindLessonByCourseInput = schema_1.inputObjectType({
    name: 'FindLessonByCourseInput',
    definition(t) {
        t.id('courseId', { required: true });
    },
});
exports.FindLessonByCoursePayload = schema_1.objectType({
    name: 'FindLessonByCoursePayload',
    definition(t) {
        t.list.field('lessons', { type: _1.Lesson });
    },
});
exports.FindLessonByCourse = schema_1.queryField('findLessonByCourse', {
    type: exports.FindLessonByCoursePayload,
    args: { input: schema_1.arg({ type: exports.FindLessonByCourseInput, required: true }) },
    resolve(_, { input: { courseId } }, { lessonData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessons = yield lessonData
                .find({ 'assignedCourses._id': new mongodb_1.ObjectId(courseId) })
                .toArray();
            return { lessons };
        });
    },
});
//# sourceMappingURL=findLessonsByCourse.js.map