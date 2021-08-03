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
exports.SubmitEssayFinalDraft = exports.SubmitEssayFinalDraftPayload = exports.SubmitEssayFinalDraftInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.SubmitEssayFinalDraftInput = schema_1.inputObjectType({
    name: 'SubmitEssayFinalDraftInput',
    definition(t) {
        t.id('_id', { required: true });
        t.field('submittedFinalDraft', {
            type: _1.SubmittedFinalDraftsInput,
            required: true,
        });
        t.boolean('late', { required: true });
        t.string('submitTime', { required: true });
        t.boolean('paperBased', { required: true });
    },
});
exports.SubmitEssayFinalDraftPayload = schema_1.objectType({
    name: 'SubmitEssayFinalDraftPayload',
    definition(t) {
        t.field('essay', { type: _1.Essay });
    },
});
exports.SubmitEssayFinalDraft = schema_1.mutationField('submitEssayFinalDraft', {
    type: exports.SubmitEssayFinalDraftPayload,
    args: { input: schema_1.arg({ type: exports.SubmitEssayFinalDraftInput, required: true }) },
    resolve(_, { input: { _id, submittedFinalDraft, late, paperBased, submitTime } }, { assignmentData, studentData, generalData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essayCheck = yield assignmentData.findOne({ _id: new mongodb_1.ObjectId(_id) });
            const beginningValue = [
                {
                    type: 'paragraph',
                    children: [{ text: '' }],
                },
            ];
            const currentMarkingPeriod = yield generalData.findOne({ currentMarkingPeriod: { $exists: true } });
            function handleLateness() {
                const submittedDateTime = submitTime;
                const dueDateTime = `${essayCheck.dueDate}, ${essayCheck.dueTime}`;
                if (Date.parse(submittedDateTime) > Date.parse(dueDateTime)) {
                    return true;
                }
                else
                    return false;
            }
            if (paperBased === true) {
                if (essayCheck) {
                    yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(_id) }, {
                        $set: {
                            late: late,
                            assigned: false,
                            paperBased,
                            'finalDraft.submitted': true,
                            'finalDraft.returned': false,
                            'finalDraft.submitTime': submitTime,
                        },
                    });
                    yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(_id) }, {
                        $push: { 'finalDraft.submittedFinalDraft': submittedFinalDraft },
                    });
                    yield studentData.updateOne({
                        'student._id': new mongodb_1.ObjectId(essayCheck.hasOwner._id),
                        markingPeriod: essayCheck.markingPeriod,
                        responsibilityPoints: { $exists: true },
                    }, {
                        $inc: { responsibilityPoints: handleLateness() ? 4 : 7 },
                    });
                    const submittedEssay = yield assignmentData.findOne({
                        _id: new mongodb_1.ObjectId(_id),
                    });
                    return { essay: submittedEssay };
                }
            }
            if (essayCheck) {
                yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(_id) }, {
                    $set: {
                        late: handleLateness(),
                        assigned: false,
                        paperBased,
                        'workingDraft.draft': JSON.stringify(beginningValue),
                        'finalDraft.submitted': true,
                        'finalDraft.returned': false,
                        'finalDraft.submitTime': submitTime,
                    },
                });
                if (!essayCheck.finalDraft)
                    yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(_id) }, {
                        $push: { 'finalDraft.submittedFinalDraft': submittedFinalDraft },
                    });
                yield studentData.updateOne({
                    'student._id': new mongodb_1.ObjectId(essayCheck.hasOwner._id),
                    markingPeriod: essayCheck.markingPeriod,
                    responsibilityPoints: { $exists: true },
                }, {
                    $inc: { responsibilityPoints: handleLateness() ? 4 : 7 },
                });
                const submittedEssay = yield assignmentData.findOne({
                    _id: new mongodb_1.ObjectId(_id),
                });
                return { essay: submittedEssay };
            }
            else
                throw new Error('Essay does not exist');
        });
    },
});
//# sourceMappingURL=submitEssayFinalDraft.js.map