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
exports.CourseTypeEnum = exports.CourseInput = exports.Course = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const mongodb_1 = require("mongodb");
const lessons_1 = require("../lessons");
const courseInfo_1 = require("./courseInfo");
exports.Course = schema_1.objectType({
    name: 'Course',
    definition(t) {
        t.id('_id', { nullable: true });
        t.string('name');
        t.field('hasCourseInfo', {
            type: courseInfo_1.CourseInfo,
            resolve(parent, __, { courseData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const info = yield courseData.findOne({
                        '': parent._id,
                    });
                    return info;
                });
            },
            nullable: true,
        });
        t.field('hasTeacher', {
            type: __1.Teacher,
            resolve(parent, __, { userData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const teacher = yield userData.findOne({
                        'teachesCourses._id': new mongodb_1.ObjectId(parent._id),
                    });
                    return teacher;
                });
            },
        });
        t.list.field('hasSignInSheets', {
            type: __1.StudentSignInSheet,
            resolve(parent, __, { schoolDayData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const schoolDay = yield schoolDayData
                        .find({
                        'signInSheets.course._id': new mongodb_1.ObjectId(parent._id),
                    })
                        .toArray();
                    const StudentSignInSheetList = [];
                    schoolDay.forEach((day) => {
                        const { signInSheets } = day;
                        signInSheets === null || signInSheets === void 0 ? void 0 : signInSheets.forEach((sheet) => {
                            const signInsheet = {
                                course: sheet.course,
                                lessonDate: sheet.lessonDate,
                                studentsSignInlog: sheet.studentsSignInlog,
                            };
                            StudentSignInSheetList.push(signInsheet);
                        });
                    });
                    return StudentSignInSheetList;
                });
            },
        });
        t.list.field('hasStudents', {
            type: __1.Student,
            resolve(parent, __, { userData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const students = yield userData
                        .find({ 'inCourses._id': new mongodb_1.ObjectId(parent._id) })
                        .toArray();
                    return students;
                });
            },
        });
        t.list.field('hasLessons', {
            type: lessons_1.Lesson,
            resolve(parent, __, { lessonData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const lessons = yield lessonData
                        .find({
                        'assignedCourses._id': new mongodb_1.ObjectId(parent._id),
                    })
                        .toArray();
                    return lessons;
                });
            },
        });
    },
});
exports.CourseInput = schema_1.inputObjectType({
    name: 'CourseInput',
    definition(t) {
        t.id('_id', { required: true });
        t.string('name');
    },
});
exports.CourseTypeEnum = schema_1.enumType({
    name: 'CourseTypeEnum',
    members: [
        'SOCIAL_STUDIES',
        'ENGLISH_LANGUAGE_ARTS',
        'SCIENCE',
        'MATH',
        'RELATED_ARTS',
    ],
});
//# sourceMappingURL=course.js.map