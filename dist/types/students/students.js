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
const users_1 = require("../users");
const __1 = require("..");
const mongodb_1 = require("mongodb");
const responsibilityPoints_1 = require("./responsibilityPoints");
exports.Student = schema_1.objectType({
    name: 'Student',
    definition(t) {
        t.implements(users_1.User);
        t.field('hasContactInformation', {
            type: 'StudentInformation',
            resolve(parent, __, { studentData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const studentInfo = yield studentData.findOne({
                        'student._id': new mongodb_1.ObjectId(parent._id),
                        contactInfo: { $exists: true },
                    });
                    return studentInfo;
                });
            },
        });
        t.list.field('hasAssignments', {
            type: 'Assignment',
            resolve(parent, __, { assignmentData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const assignments = yield assignmentData
                        .find({ 'hasOwner._id': parent._id })
                        .toArray();
                    return assignments;
                });
            },
        });
        t.list.field('inCourses', { type: __1.Course });
        t.list.field('hasAbsences', {
            type: 'StudentAbsence',
            resolve(parent, __, { studentData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const absences = yield studentData
                        .find({
                        'student._id': new mongodb_1.ObjectId(parent._id),
                        dayAbsent: { $exists: true },
                    })
                        .toArray();
                    return absences;
                });
            },
        });
        t.list.field('hasExcusedLatenesses', {
            type: 'ExcusedLateness',
            resolve(parent, __, { studentData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const excusedLatenesses = yield studentData
                        .find({
                        'student._id': new mongodb_1.ObjectId(parent._id),
                        dayLateExcused: { $exists: true },
                    })
                        .toArray();
                    return excusedLatenesses;
                });
            },
        });
        t.list.field('hasUnExcusedLatenesses', {
            type: 'UnexcusedLateness',
            resolve(parent, __, { studentData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const unexcusedLatenesses = yield studentData
                        .find({
                        'student._id': new mongodb_1.ObjectId(parent._id),
                        dayLate: { $exists: true },
                    })
                        .toArray();
                    return unexcusedLatenesses;
                });
            },
        });
        t.list.field('hasResponsibilityPoints', {
            type: responsibilityPoints_1.ResponsibilityPoints,
            resolve(parent, __, { studentData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const responsibilityPoints = yield studentData
                        .find({
                        'student._id': new mongodb_1.ObjectId(parent._id),
                        responsibilityPoints: { $exists: true },
                    })
                        .toArray();
                    return responsibilityPoints;
                });
            },
        });
        t.field('hasWritingMetrics', {
            type: __1.WritingMetrics,
            resolve(parent, __, { studentData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const writingMetrics = yield studentData.findOne({
                        'student._id': new mongodb_1.ObjectId(parent._id),
                        howProblemSolutionMetrics: { $exists: true },
                    });
                    return writingMetrics;
                });
            },
        });
    },
});
//# sourceMappingURL=students.js.map