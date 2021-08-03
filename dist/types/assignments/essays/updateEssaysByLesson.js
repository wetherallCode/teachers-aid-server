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
exports.UpdateEssaysByLesson = exports.UpdateEssaysByLessonPayload = exports.UpdateEssaysByLessonInput = void 0;
const schema_1 = require("@nexus/schema");
const essays_1 = require("./essays");
const general_1 = require("../../general");
exports.UpdateEssaysByLessonInput = schema_1.inputObjectType({
    name: 'UpdateEssaysByLessonInput',
    definition(t) {
        t.id('lessonId', { required: true });
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum, required: true });
    },
});
exports.UpdateEssaysByLessonPayload = schema_1.objectType({
    name: 'UpdateEssaysByLessonPayload',
    definition(t) {
        t.list.field('essays', { type: essays_1.Essay });
    },
});
exports.UpdateEssaysByLesson = schema_1.mutationField('updateEssaysByLesson', {
    type: exports.UpdateEssaysByLessonPayload,
    description: 'only useful for changing marking period',
    args: { input: schema_1.arg({ type: exports.UpdateEssaysByLessonInput, required: true }) },
    resolve(_, { input: { lessonId, markingPeriod } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essayValidation = yield assignmentData
                .find({
                associatedLessonId: lessonId,
                workingDraft: { $exists: true },
            })
                .toArray();
            if (essayValidation.length > 0) {
                yield assignmentData.updateMany({
                    associatedLessonId: lessonId,
                    workingDraft: { $exists: true },
                }, { $set: { markingPeriod: markingPeriod } });
                const essays = yield assignmentData
                    .find({
                    associatedLessonId: lessonId,
                })
                    .toArray();
                return { essays };
            }
            else
                throw new Error('No essays for that lesson');
        });
    },
});
//# sourceMappingURL=updateEssaysByLesson.js.map