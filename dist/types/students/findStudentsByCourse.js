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
exports.FindStudentsByCourse = exports.FindStudentsByCoursePayload = exports.FindStudentsByCourseInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FindStudentsByCourseInput = schema_1.inputObjectType({
    name: 'FindStudentsByCourseInput',
    definition(t) {
        t.id('courseId', { required: true });
    },
});
exports.FindStudentsByCoursePayload = schema_1.objectType({
    name: 'FindStudentsByCoursePayload',
    definition(t) {
        t.list.field('students', { type: _1.Student });
    },
});
exports.FindStudentsByCourse = schema_1.queryField('findStudentsByCourse', {
    type: exports.FindStudentsByCoursePayload,
    args: { input: schema_1.arg({ type: exports.FindStudentsByCourseInput, required: true }) },
    resolve(_, { input: { courseId } }, { userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const students = yield userData
                .find({ 'inCourses._id': new mongodb_1.ObjectId(courseId) })
                .toArray();
            return { students };
        });
    },
});
//# sourceMappingURL=findStudentsByCourse.js.map