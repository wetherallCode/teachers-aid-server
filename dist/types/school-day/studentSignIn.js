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
exports.StudentSignIn = exports.StudentSignInPayload = exports.StudentSignInInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.StudentSignInInput = schema_1.inputObjectType({
    name: 'StudentSignInInput',
    definition(t) {
        t.id('studentId', { required: true });
        t.id('courseId', { required: true });
        t.string('lessonDate', { required: true });
        t.boolean('virtual');
    },
});
exports.StudentSignInPayload = schema_1.objectType({
    name: 'StudentSignInPayload',
    definition(t) {
        t.field('schoolDay', { type: _1.SchoolDay });
    },
});
exports.StudentSignIn = schema_1.mutationField('studentSignIn', {
    type: exports.StudentSignInPayload,
    args: { input: schema_1.arg({ type: exports.StudentSignInInput, required: true }) },
    resolve(_, { input: { studentId, lessonDate, courseId } }, { schoolDayData, userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield userData.findOne({ _id: new mongodb_1.ObjectId(studentId) });
            if (student) {
                yield schoolDayData.updateOne({
                    todaysDate: lessonDate,
                    signInSheets: {
                        $elemMatch: { 'course._id': new mongodb_1.ObjectId(courseId) },
                    },
                }, {
                    $push: { 'signInSheets.$.studentsSignInlog': student },
                });
            }
            const schoolDay = yield schoolDayData.findOne({ todaysDate: lessonDate });
            return { schoolDay };
        });
    },
});
//# sourceMappingURL=studentSignIn.js.map