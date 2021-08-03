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
exports.AssignReadingGuides = exports.AssignReadingGuidesPayload = exports.AssignReadingGuidesInput = void 0;
const schema_1 = require("@nexus/schema");
const readingGuide_1 = require("./readingGuide");
const mongodb_1 = require("mongodb");
exports.AssignReadingGuidesInput = schema_1.inputObjectType({
    name: 'AssignReadingGuidesInput',
    definition(t) {
        t.list.id('studentIds', { required: true });
        t.id('associatedLessonId', { required: true });
        t.date('assignedDate', { required: true });
        t.date('dueDate', { required: true });
    },
});
exports.AssignReadingGuidesPayload = schema_1.objectType({
    name: 'AssignReadingGuidesPayload',
    definition(t) {
        t.list.field('readingGuides', { type: readingGuide_1.ReadingGuide });
    },
});
exports.AssignReadingGuides = schema_1.mutationField('assignReadingGuides', {
    type: exports.AssignReadingGuidesPayload,
    args: { input: schema_1.arg({ type: exports.AssignReadingGuidesInput, required: true }) },
    resolve(_, { input: { studentIds, associatedLessonId, assignedDate, dueDate } }, { assignmentData, studentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const readingGuides = [];
            for (const _id of studentIds) {
                const readingGuideValidation = yield assignmentData.findOne({
                    'hasOwner._id': new mongodb_1.ObjectId(_id),
                    associatedLessonId,
                    articleTitle: { $exists: false },
                    workingDraft: { $exists: false },
                });
                if (readingGuideValidation) {
                    yield assignmentData.updateOne({
                        'hasOwner._id': new mongodb_1.ObjectId(_id),
                        associatedLessonId,
                        completed: { $exists: true },
                    }, {
                        $set: {
                            dueDate,
                            assignedDate,
                            assigned: true,
                        },
                    });
                    yield studentData.updateOne({
                        'student._id': new mongodb_1.ObjectId(_id),
                        markingPeriod: readingGuideValidation.markingPeriod,
                        responsibilityPoints: { $exists: true },
                    }, {
                        $inc: { responsibilityPoints: -2 },
                    });
                }
                const readingGuide = yield assignmentData.findOne({
                    'hasOwner._id': new mongodb_1.ObjectId(_id),
                    associatedLessonId,
                    completed: { $exists: true },
                });
                readingGuides.push(readingGuide);
            }
            return { readingGuides };
        });
    },
});
//# sourceMappingURL=assignReadingGuides.js.map