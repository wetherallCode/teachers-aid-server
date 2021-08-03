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
exports.CreateSignInSheets = exports.CreateSignInSheetsPayload = exports.CreateSignInSheetsInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.CreateSignInSheetsInput = schema_1.inputObjectType({
    name: 'CreateSignInSheetsInput',
    definition(t) {
        t.list.id('courseIds', { required: true });
        t.string('todaysDate', { required: true });
    },
});
exports.CreateSignInSheetsPayload = schema_1.objectType({
    name: 'CreateSignInSheetsPayload',
    definition(t) {
        t.field('schoolDay', { type: _1.SchoolDay });
    },
});
exports.CreateSignInSheets = schema_1.mutationField('createSignInSheets', {
    type: exports.CreateSignInSheetsPayload,
    args: { input: schema_1.arg({ type: exports.CreateSignInSheetsInput, required: true }) },
    resolve(_, { input: { todaysDate, courseIds } }, { schoolDayData, courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const schoolDayCheck = yield schoolDayData.findOne({
                todaysDate: todaysDate,
            });
            if (schoolDayCheck) {
                for (const _id of courseIds) {
                    const course = yield courseData.findOne({
                        _id: new mongodb_1.ObjectId(_id),
                    });
                    yield schoolDayData.updateOne({ todaysDate: todaysDate }, {
                        $push: {
                            signInSheets: {
                                course: course,
                                studentsSignInlog: [],
                                lessonDate: todaysDate,
                            },
                        },
                    });
                    const newStudentQuestions = {
                        associatedSchoolDayId: schoolDayCheck._id,
                        course,
                        questions: [],
                        date: new Date().toLocaleDateString(),
                    };
                    const { insertedId } = yield schoolDayData.insertOne(newStudentQuestions);
                    newStudentQuestions._id = insertedId;
                }
                const schoolDay = yield schoolDayData.findOne({ todaysDate: todaysDate });
                return { schoolDay };
            }
            else
                throw new Error('School Day does not exist');
        });
    },
});
//# sourceMappingURL=createSignInSheets.js.map