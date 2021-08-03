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
exports.UpdateEssaysByStudentsAndSection = exports.UpdateEssaysByStudentsAndSectionPayload = exports.UpdateEssaysByStudentsAndSectionInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
const general_1 = require("../../general");
exports.UpdateEssaysByStudentsAndSectionInput = schema_1.inputObjectType({
    name: 'UpdateEssaysByStudentsAndSectionInput',
    definition(t) {
        t.list.id('studentId', { required: true });
        t.string('section', { required: true });
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum });
        t.string('dueTime', { required: true });
        t.date('assignedDate', { required: true });
        t.date('dueDate', { required: true });
        t.int('maxPoints', { required: true });
    },
});
exports.UpdateEssaysByStudentsAndSectionPayload = schema_1.objectType({
    name: 'UpdateEssaysByStudentsAndSectionPayload',
    definition(t) {
        t.list.field('essays', { type: _1.Essay });
    },
});
exports.UpdateEssaysByStudentsAndSection = schema_1.mutationField('updateEssaysByStudentsAndSection', {
    type: exports.UpdateEssaysByStudentsAndSectionPayload,
    description: 'For updating an assignment for an entire course(s)',
    args: {
        input: schema_1.arg({
            type: exports.UpdateEssaysByStudentsAndSectionInput,
            required: true,
        }),
    },
    resolve(_, { input: { studentId, section, markingPeriod, dueTime, dueDate, assignedDate, maxPoints, }, }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essays = [];
            const studentIdsWithNoEssay = [];
            for (const _id of studentId) {
                const essayValidation = yield assignmentData.findOne({
                    'hasOwner._id': new mongodb_1.ObjectId(_id),
                    'readings.readingSections': section,
                    workingDraft: { $exists: true },
                });
                if (essayValidation) {
                    yield assignmentData.updateOne({
                        'hasOwner._id': new mongodb_1.ObjectId(_id),
                        'readings.readingSections': section,
                        workingDraft: { $exists: true },
                    }, {
                        $set: {
                            markingPeriod,
                            dueTime,
                            dueDate,
                            assignedDate,
                            'score.maxPoints': maxPoints,
                        },
                    });
                }
                const essay = yield assignmentData.findOne({
                    'hasOwner._id': new mongodb_1.ObjectId(_id),
                    'readings.readingSections': section,
                    workingDraft: { $exists: true },
                });
                essays.push(essay);
            }
            return { essays };
        });
    },
});
//# sourceMappingURL=updateEssaysByStudentsAndSection.js.map