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
exports.SubmitReadingGuide = exports.SubmitReadingGuidePayload = exports.SubmitReadingGuideInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.SubmitReadingGuideInput = schema_1.inputObjectType({
    name: 'SubmitReadingGuideInput',
    definition(t) {
        t.id('readingGuideId', { required: true });
        t.boolean('late', { required: true });
        t.string('submitTime', { required: true });
        t.boolean('paperBased', { required: true });
        t.boolean('completeReadingGuide');
    },
});
exports.SubmitReadingGuidePayload = schema_1.objectType({
    name: 'SubmitReadingGuidePayload',
    definition(t) {
        t.field('readingGuide', { type: _1.ReadingGuide });
    },
});
exports.SubmitReadingGuide = schema_1.mutationField('submitReadingGuide', {
    type: exports.SubmitReadingGuidePayload,
    args: { input: schema_1.arg({ type: exports.SubmitReadingGuideInput, required: true }) },
    resolve(_, { input: { readingGuideId, late, submitTime, paperBased, completeReadingGuide, }, }, { assignmentData, studentData, generalData }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const readingGuideValidation = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectId(readingGuideId),
            });
            const studentResponsibilityPoints = yield studentData.findOne({
                'student._id': new mongodb_1.ObjectId(readingGuideValidation.hasOwner._id),
                markingPeriod: readingGuideValidation.markingPeriod,
                responsibilityPoints: { $exists: true },
            });
            const currentMarkingPeriod = yield generalData.findOne({ currentMarkingPeriod: { $exists: true } });
            if (readingGuideValidation) {
                if (paperBased) {
                    yield assignmentData.updateOne({
                        _id: new mongodb_1.ObjectId(readingGuideId),
                    }, {
                        $set: {
                            late,
                            graded: true,
                            completed: completeReadingGuide,
                            'score.earnedPoints': completeReadingGuide ? 10 : 2,
                        },
                    });
                    if (studentResponsibilityPoints) {
                        studentData.updateOne({
                            'student._id': new mongodb_1.ObjectId(readingGuideValidation.hasOwner._id),
                            markingPeriod: readingGuideValidation.markingPeriod,
                            responsibilityPoints: { $exists: true },
                        }, {
                            $inc: {
                                responsibilityPoints: completeReadingGuide && late === false
                                    ? 12
                                    : completeReadingGuide && late
                                        ? 7
                                        : 4,
                            },
                        });
                    }
                    const readingGuide = yield assignmentData.findOne({
                        _id: new mongodb_1.ObjectId(readingGuideId),
                    });
                    return { readingGuide };
                }
            }
            function handleLateness() {
                const submittedDateTime = submitTime;
                const dueDateTime = `${readingGuideValidation.dueDate}, ${readingGuideValidation.dueTime}`;
                if (Date.parse(submittedDateTime) > Date.parse(dueDateTime)) {
                    return true;
                }
                else
                    return false;
            }
            const { majorIssue, majorSolution, clarifyingQuestions, } = readingGuideValidation.readingGuideFinal;
            const clarifyingQuestionComplete = clarifyingQuestions.length !== 0;
            const majorSolutionComplete = majorSolution !== '';
            const majorIssueComplete = majorIssue !== '';
            const complete = clarifyingQuestionComplete && majorSolutionComplete && majorIssueComplete;
            if (readingGuideValidation) {
                assignmentData.updateOne({
                    _id: new mongodb_1.ObjectId(readingGuideId),
                }, {
                    $set: {
                        completed: complete,
                        graded: true,
                        assigned: false,
                        'score.earnedPoints': complete && handleLateness() === false
                            ? readingGuideValidation.score.maxPoints
                            : complete && handleLateness() === true
                                ? readingGuideValidation.score.maxPoints % 2
                                : 2,
                        late: handleLateness(),
                        'readingGuideFinal.submitted': true,
                        'readingGuideFinal.submitTime': submitTime,
                    },
                });
                if (!((_a = readingGuideValidation.readingGuideFinal) === null || _a === void 0 ? void 0 : _a.submitted)) {
                    studentData.updateOne({
                        'student._id': new mongodb_1.ObjectId(readingGuideValidation.hasOwner._id),
                        markingPeriod: readingGuideValidation.markingPeriod,
                        responsibilityPoints: { $exists: true },
                    }, {
                        $inc: {
                            responsibilityPoints: complete && handleLateness() === false
                                ? readingGuideValidation.score.maxPoints + 2
                                : complete && handleLateness() === true
                                    ? (readingGuideValidation.score.maxPoints % 2) + 2
                                    : 3,
                        },
                    });
                }
                const readingGuide = yield assignmentData.findOne({
                    _id: new mongodb_1.ObjectId(readingGuideId),
                });
                return { readingGuide };
            }
            else
                throw new Error('Reading Guide does not exist.');
        });
    },
});
//# sourceMappingURL=submitReadingGuide.js.map