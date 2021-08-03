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
exports.InitializeStudents = exports.InitializeStudentsPayload = exports.InitializeStudentsInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.InitializeStudentsInput = schema_1.inputObjectType({
    name: 'InitializeStudentsInput',
    definition(t) {
        t.list.id('studentIds', { required: true });
        t.id('courseId', { required: true });
    },
});
exports.InitializeStudentsPayload = schema_1.objectType({
    name: 'InitializeStudentsPayload',
    definition(t) {
        t.list.field('students', { type: _1.Student });
    },
});
exports.InitializeStudents = schema_1.mutationField('initializeStudents', {
    type: exports.InitializeStudentsPayload,
    args: { input: schema_1.arg({ type: exports.InitializeStudentsInput, required: true }) },
    resolve(_, { input: { studentIds, courseId } }, { userData, studentData, courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseData.findOne({ _id: new mongodb_1.ObjectId(courseId) });
            const markingPeriodList = [
                'FIRST',
                'SECOND',
                'THIRD',
                'FOURTH',
            ];
            let responsibilityPointsList = [];
            for (const _id of studentIds) {
                const student = yield userData.findOne({ _id: new mongodb_1.ObjectId(_id) });
                for (const mp of markingPeriodList) {
                    const responsibilityPointsCheck = yield studentData.findOne({
                        'student._id': new mongodb_1.ObjectId(_id),
                        responsibilityPoints: { $exists: true },
                        markingPeriod: mp,
                        inCourse: course,
                    });
                    if (!responsibilityPointsCheck) {
                        const responsibilityPoints = {
                            markingPeriod: mp,
                            responsibilityPoints: 100,
                            student,
                            inCourse: course,
                        };
                        const { insertedId } = yield studentData.insertOne(responsibilityPoints);
                        responsibilityPoints._id = insertedId;
                        responsibilityPointsList.push(responsibilityPoints);
                    }
                }
                const contactInfoCheck = yield studentData.findOne({
                    'student._id': new mongodb_1.ObjectId(_id),
                    contactInfo: { $exists: true },
                });
                if (!contactInfoCheck) {
                    const studentInformation = {
                        student,
                        contactInfo: [
                            {
                                guardianFirstName: '',
                                guardianLastName: '',
                                guardianPhone: '',
                                guardianEmail: '',
                            },
                        ],
                    };
                    const { insertedId } = yield studentData.insertOne(studentInformation);
                    studentInformation._id = insertedId;
                }
                const studentWritingMetric = yield studentData.findOne({
                    'student._id': new mongodb_1.ObjectId(_id),
                    howCauseEffectMetrics: { $exists: true },
                });
                if (!studentWritingMetric) {
                    const writingMetric = {
                        student,
                        inCourse: course,
                        overallWritingMetric: {
                            overallWritingLevel: 'DEVELOPING',
                            levelPoints: 0,
                        },
                        howCauseEffectMetrics: {
                            howCauseEffectLevel: 'DEVELOPING',
                            levelPoints: 0,
                        },
                        howProblemSolutionMetrics: {
                            howProblemSolutionLevel: 'DEVELOPING',
                            levelPoints: 0,
                        },
                        whyCauseEffectMetrics: {
                            whyCauseEffectLevel: 'DEVELOPING',
                            levelPoints: 0,
                        },
                    };
                    const { insertedId } = yield studentData.insertOne(writingMetric);
                    writingMetric._id = insertedId;
                }
            }
            const students = [];
            for (const _id of studentIds) {
                const student = yield userData.findOne({ _id: new mongodb_1.ObjectId(_id) });
                students.push(student);
            }
            return { students };
        });
    },
});
//# sourceMappingURL=initializeStudents.js.map