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
exports.CreateStudentQuestion = exports.CreateStudentQuestionPayload = exports.CreateStudentQuestionInput = void 0;
const schema_1 = require("@nexus/schema");
const studentQuestion_1 = require("./studentQuestion");
const mongodb_1 = require("mongodb");
exports.CreateStudentQuestionInput = schema_1.inputObjectType({
    name: 'CreateStudentQuestionInput',
    definition(t) {
        t.id('studentId', { required: true });
        t.id('courseId', { required: true });
        t.string('question', { required: true });
    },
});
exports.CreateStudentQuestionPayload = schema_1.objectType({
    name: 'CreateStudentQuestionPayload',
    definition(t) {
        t.field('studentQuestions', { type: studentQuestion_1.StudentQuestions });
    },
});
exports.CreateStudentQuestion = schema_1.mutationField('createStudentQuestion', {
    type: exports.CreateStudentQuestionPayload,
    args: { input: schema_1.arg({ type: exports.CreateStudentQuestionInput, required: true }) },
    resolve(_, { input: { studentId, courseId, question } }, { schoolDayData, userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentQuestionsCheck = yield schoolDayData.findOne({
                date: new Date().toLocaleDateString(),
                'course._id': new mongodb_1.ObjectId(courseId),
                questions: { $exists: true },
            });
            if (studentQuestionsCheck) {
                const student = yield userData.findOne({ _id: new mongodb_1.ObjectId(studentId) });
                yield schoolDayData.updateOne({
                    date: new Date().toLocaleDateString(),
                    'course._id': new mongodb_1.ObjectId(courseId),
                    questions: { $exists: true },
                }, {
                    $push: {
                        questions: {
                            student,
                            timeAsked: new Date().toLocaleTimeString(),
                            question,
                        },
                    },
                });
                const studentQuestions = yield schoolDayData.findOne({
                    date: new Date().toLocaleDateString(),
                    questions: { $exists: true },
                });
                return { studentQuestions };
            }
            else
                throw new Error('Student Questions do not exist');
        });
    },
});
//# sourceMappingURL=createStudentQuestion.js.map