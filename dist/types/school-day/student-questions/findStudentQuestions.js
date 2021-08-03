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
exports.FindStudentQuestions = exports.FindStudentQuestionsPayload = exports.FindStudentQuestionsInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FindStudentQuestionsInput = schema_1.inputObjectType({
    name: 'FindStudentQuestionsInput',
    definition(t) {
        t.id('courseId', { required: true });
        t.string('date', { required: true });
    },
});
exports.FindStudentQuestionsPayload = schema_1.objectType({
    name: 'FindStudentQuestionsPayload',
    definition(t) {
        t.list.field('studentQuestions', { type: _1.StudentQuestion });
    },
});
exports.FindStudentQuestions = schema_1.queryField('findStudentQuestions', {
    type: exports.FindStudentQuestionsPayload,
    args: { input: schema_1.arg({ type: exports.FindStudentQuestionsInput, required: true }) },
    resolve(_, { input: { courseId, date } }, { schoolDayData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentQuestionContainer = yield schoolDayData.findOne({ 'course._id': new mongodb_1.ObjectId(courseId), date });
            if (studentQuestionContainer) {
                const studentQuestions = studentQuestionContainer.questions;
                return { studentQuestions };
            }
            else
                throw new Error('No Question Container exists.');
        });
    },
});
//# sourceMappingURL=findStudentQuestions.js.map