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
exports.ReturnGradedEssay = exports.ReturnGradedEssayPayload = exports.ReturnedRubricEntryInput = exports.ReturnGradedEssayInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
const rubrics_1 = require("./rubrics");
exports.ReturnGradedEssayInput = schema_1.inputObjectType({
    name: 'ReturnGradedEssayInput',
    definition(t) {
        t.id('_id', { required: true });
        t.string('gradingDraft', { required: true });
        t.list.field('rubricEntries', {
            type: exports.ReturnedRubricEntryInput,
            required: true,
        });
        t.int('draftNumber', { required: true });
        t.list.string('additionalComments');
        t.float('score', { required: true });
    },
});
exports.ReturnedRubricEntryInput = schema_1.inputObjectType({
    name: 'ReturnedRubricEntryInput',
    definition(t) {
        t.id('_id');
        t.string('entry', { required: true });
        t.int('score', { required: true });
        t.field('rubricSection', { type: rubrics_1.RubricSectionEnum, required: true });
        t.string('howToImprove');
    },
});
exports.ReturnGradedEssayPayload = schema_1.objectType({
    name: 'ReturnGradedEssayPayload',
    definition(t) {
        t.field('essay', { type: _1.Essay });
    },
});
exports.ReturnGradedEssay = schema_1.mutationField('returnGradedEssay', {
    type: exports.ReturnGradedEssayPayload,
    args: { input: schema_1.arg({ type: exports.ReturnGradedEssayInput, required: true }) },
    resolve(_, { input: { _id, gradingDraft, rubricEntries, additionalComments, score, draftNumber, }, }, { assignmentData, studentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essay = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectID(_id),
            });
            const currentScore = essay.score.earnedPoints;
            const student = essay.hasOwner;
            if (currentScore < score) {
                yield assignmentData.updateOne({ _id: new mongodb_1.ObjectID(_id) }, {
                    $set: {
                        'score.earnedPoints': score,
                    },
                });
            }
            if (!essay.leveledUp) {
                if (score >= 4) {
                    const studentToLevelUp = yield studentData.findOne({
                        'student._id': new mongodb_1.ObjectId(student._id),
                        overallWritingMetric: { $exists: true },
                    });
                    const { levelPoints } = studentToLevelUp.overallWritingMetric;
                    yield studentData.updateOne({
                        'student._id': new mongodb_1.ObjectId(student._id),
                        overallWritingMetric: { $exists: true },
                    }, {
                        $set: {
                            'overallWritingMetric.levelPoints': levelPoints + 1,
                        },
                    });
                    if (levelPoints === 10) {
                        yield studentData.updateOne({
                            'student._id': new mongodb_1.ObjectId(student._id),
                            overallWritingMetric: { $exists: true },
                        }, {
                            $set: {
                                'overallWritingMetric.overallWritingLevel': 'ACADEMIC',
                            },
                        });
                    }
                    yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(_id) }, {
                        $set: { leveledUp: true },
                    });
                }
            }
            yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(_id) }, {
                $set: {
                    'finalDraft.returned': true,
                    'finalDraft.submitted': false,
                },
            });
            yield assignmentData.updateOne({
                _id: new mongodb_1.ObjectId(_id),
                'finalDraft.submittedFinalDraft': {
                    $elemMatch: { draftNumber: draftNumber },
                },
            }, {
                $set: {
                    'finalDraft.submittedFinalDraft.$.draft': gradingDraft,
                    'finalDraft.submittedFinalDraft.$.rubricEntries': rubricEntries,
                    'finalDraft.submittedFinalDraft.$.additionalComments': additionalComments,
                    'finalDraft.submittedFinalDraft.$.score': score,
                    'finalDraft.submittedFinalDraft.$.graded': true,
                },
            });
            const returnedEssay = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectID(_id),
            });
            return { essay: returnedEssay };
        });
    },
});
//# sourceMappingURL=returnGradedEssay.js.map