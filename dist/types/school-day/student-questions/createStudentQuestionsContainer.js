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
exports.CreateStudentQuestionsContainer = exports.CreateStudentQuestionsContainerPayload = exports.CreateStudentQuestionsContainerInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.CreateStudentQuestionsContainerInput = schema_1.inputObjectType({
    name: 'CreateStudentQuestionsContainerInput',
    definition(t) {
        t.id('associatedSchoolDayId', { required: true });
        t.id('courseId', { required: true });
        t.string('date', { required: true });
    },
});
exports.CreateStudentQuestionsContainerPayload = schema_1.objectType({
    name: 'CreateStudentQuestionsContainerPayload',
    definition(t) {
        t.field('studentQuestions', { type: _1.StudentQuestions });
    },
});
exports.CreateStudentQuestionsContainer = schema_1.mutationField('createStudentQuestionsContainer', {
    type: exports.CreateStudentQuestionsContainerPayload,
    args: {
        input: schema_1.arg({
            type: exports.CreateStudentQuestionsContainerInput,
            required: true,
        }),
    },
    resolve(_, { input: { associatedSchoolDayId, courseId, date } }, { schoolDayData, courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseData.findOne({ _id: new mongodb_1.ObjectId(courseId) });
            const newStudentQuestions = {
                associatedSchoolDayId: associatedSchoolDayId,
                course,
                questions: [],
                date,
            };
            const { insertedId } = yield schoolDayData.insertOne(newStudentQuestions);
            newStudentQuestions._id = insertedId;
            return { studentQuestions: newStudentQuestions };
        });
    },
});
//# sourceMappingURL=createStudentQuestionsContainer.js.map