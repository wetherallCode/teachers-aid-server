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
exports.AssignEssays = exports.AssignEssaysPayload = exports.AssignEssaysInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.AssignEssaysInput = schema_1.inputObjectType({
    name: 'AssignEssaysInput',
    definition(t) {
        t.list.id('studentIds', { required: true });
        t.id('associatedLessonId', { required: true });
        t.date('assignedDate', { required: true });
        t.date('dueDate', { required: true });
    },
});
exports.AssignEssaysPayload = schema_1.objectType({
    name: 'AssignEssaysPayload',
    definition(t) {
        t.list.field('essays', { type: _1.Essay });
    },
});
exports.AssignEssays = schema_1.mutationField('assignEssays', {
    type: exports.AssignEssaysPayload,
    args: { input: schema_1.arg({ type: exports.AssignEssaysInput, required: true }) },
    resolve(_, { input: { studentIds, associatedLessonId, assignedDate, dueDate } }, { assignmentData, studentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essays = [];
            for (const _id of studentIds) {
                const essayValidation = yield assignmentData.findOne({
                    'hasOwner._id': new mongodb_1.ObjectId(_id),
                    associatedLessonId,
                    workingDraft: { $exists: true },
                });
                if (essayValidation) {
                    yield assignmentData.updateOne({
                        'hasOwner._id': new mongodb_1.ObjectId(_id),
                        associatedLessonId,
                        workingDraft: { $exists: true },
                    }, {
                        $set: {
                            dueDate,
                            assignedDate,
                            assigned: true,
                        },
                    });
                    yield studentData.updateOne({
                        'student._id': new mongodb_1.ObjectId(_id),
                        markingPeriod: essayValidation.markingPeriod,
                        responsibilityPoints: { $exists: true },
                    }, {
                        $inc: { responsibilityPoints: -2 },
                    });
                }
                const essay = yield assignmentData.findOne({
                    'hasOwner._id': new mongodb_1.ObjectId(_id),
                    associatedLessonId,
                    workingDraft: { $exists: true },
                });
                essays.push(essay);
            }
            return { essays };
        });
    },
});
//# sourceMappingURL=assignEssays.js.map