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
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FindLessonByCourseAndDateInput = schema_1.inputObjectType({
    name: 'FindLessonByCourseAndDateInput',
    definition(t) {
        t.id('courseId', { required: true });
        t.date('lessonDate', { required: true });
    },
});
exports.FindLessonByCourseAndDatePayload = schema_1.objectType({
    name: 'FindLessonByCourseAndDatePayload',
    definition(t) {
        t.field('lesson', { type: _1.Lesson });
    },
});
exports.FindLessonByCourseAndDate = schema_1.queryField('findLessonByCourseAndDate', {
    type: exports.FindLessonByCourseAndDatePayload,
    args: {
        input: schema_1.arg({ type: exports.FindLessonByCourseAndDateInput, required: true }),
    },
    resolve(_, { input: { courseId, lessonDate } }, { lessonData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield lessonData.findOne({
                'assignedCourse._id': new mongodb_1.ObjectId(courseId),
                assignedDate: lessonDate,
            });
            return { lesson };
        });
    },
});
//# sourceMappingURL=findLessonByCourseAndDate.js.map