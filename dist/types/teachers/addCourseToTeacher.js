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
exports.AddCourseToTeacherInput = schema_1.inputObjectType({
    name: 'AddCourseToTeacherInput',
    definition(t) {
        t.id('teacherId', { required: true });
        t.id('courseId', { required: true });
    },
});
exports.AddCourseToTeacherPayload = schema_1.objectType({
    name: 'AddCourseToTeacherPayload',
    definition(t) {
        t.field('teacher', { type: _1.Teacher });
    },
});
exports.AddCourseToTeacher = schema_1.mutationField('addCourseToTeacher', {
    type: exports.AddCourseToTeacherPayload,
    args: { input: schema_1.arg({ type: exports.AddCourseToTeacherInput, required: true }) },
    resolve(_, { input: { teacherId, courseId } }, { userData, courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseData.findOne({ _id: new mongodb_1.ObjectId(courseId) });
            yield userData.updateOne({ _id: new mongodb_1.ObjectId(teacherId) }, { $push: { teachesCourses: course } });
            const updatedTeacher = yield userData.findOne({
                _id: new mongodb_1.ObjectId(teacherId),
            });
            return { teacher: updatedTeacher };
        });
    },
});
//# sourceMappingURL=addCourseToTeacher.js.map