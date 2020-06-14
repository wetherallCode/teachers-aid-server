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
const students_1 = require("./students");
const mongodb_1 = require("mongodb");
exports.AddStudentsToCourseInput = schema_1.inputObjectType({
    name: 'AddStudentsToCourseInput',
    definition(t) {
        t.list.id('studentIds', { required: true });
        t.id('courseId', { required: true });
    },
});
exports.AddStudentsToCoursePayload = schema_1.objectType({
    name: 'AddStudentsToCoursePayload',
    definition(t) {
        t.list.field('students', { type: students_1.Student });
    },
});
exports.AddStudentsToCourse = schema_1.mutationField('addStudentsToCourse', {
    type: exports.AddStudentsToCoursePayload,
    args: { input: schema_1.arg({ type: exports.AddStudentsToCourseInput, required: true }) },
    resolve(_, { input: { studentIds, courseId } }, { userData, courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseData.findOne({ _id: new mongodb_1.ObjectId(courseId) });
            if (!course)
                throw new Error('Course does not exist!');
            const students = [];
            const updatedStudents = [];
            const studentsAlreadyAssignedToCourse = [];
            for (const _id of studentIds) {
                const student = yield userData.findOne({
                    _id: new mongodb_1.ObjectId(_id),
                });
                if (student.inCourses.some((studentCourses) => { var _a; return ((_a = studentCourses._id) === null || _a === void 0 ? void 0 : _a.toString()) === course._id.toString(); })) {
                    studentsAlreadyAssignedToCourse.push(student);
                }
                else
                    students.push(student);
            }
            for (const student of students) {
                yield userData.updateOne({ _id: new mongodb_1.ObjectId(student._id) }, { $push: { inCourses: course } });
                const updatedStudent = yield userData.findOne({
                    _id: new mongodb_1.ObjectId(student._id),
                });
                updatedStudents.push(updatedStudent);
            }
            return { students: updatedStudents };
        });
    },
});
//# sourceMappingURL=addStudentsToCourse.js.map