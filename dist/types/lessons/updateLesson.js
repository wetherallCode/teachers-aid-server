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
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
const __1 = require("..");
exports.UpdateLessonInput = schema_1.inputObjectType({
    name: 'UpdateLessonInput',
    definition(t) {
        t.date('assignedDate', { required: true });
        t.id('inUnit', { required: true });
        t.field('assignedMarkingPeriod', {
            type: __1.MarkingPeriodEnum,
            required: true,
        });
        t.list.id('linkedCourseIds', { required: true });
        t.string('lessonName', { required: true });
        t.field('assignedSections', {
            type: _1.LessonTextSectionsInput,
            required: true,
        });
        t.field('pageNumbers', { type: __1.PageNumbersInput, required: true });
        t.list.id('assignedSectionIdList', { required: true });
        t.list.field('vocabList', { type: __1.TextSectionVocabInput, required: true });
        t.field('beforeActivity', {
            type: __1.TextSectionProtocolsInput,
            required: true,
        });
        t.list.field('duringActivities', {
            type: __1.TextSectionProtocolsInput,
            required: true,
        });
        t.field('afterActivity', {
            type: __1.TextSectionProtocolsInput,
            required: true,
        });
        t.list.field('questionList', {
            type: __1.TextSectionQuestionsInput,
            required: true,
        });
        t.string('essentialQuestion', { required: true });
    },
});
exports.UpdateLessonPayload = schema_1.objectType({
    name: 'UpdateLessonPayload',
    definition(t) {
        t.list.field('lessons', { type: _1.Lesson });
    },
});
exports.UpdateLesson = schema_1.mutationField('updateLesson', {
    type: exports.UpdateLessonPayload,
    args: { input: schema_1.arg({ type: exports.UpdateLessonInput, required: true }) },
    resolve(_, { input: { assignedDate, inUnit, lessonName, assignedMarkingPeriod, linkedCourseIds, assignedSections, pageNumbers, assignedSectionIdList, vocabList, beforeActivity, duringActivities, afterActivity, questionList, essentialQuestion, }, }, { lessonData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = yield lessonData.findOne({
                _id: new mongodb_1.ObjectId(inUnit),
            });
            for (const _id in linkedCourseIds) {
                yield lessonData.updateOne({
                    'assignedCourse._id': new mongodb_1.ObjectId(linkedCourseIds[_id]),
                    lessonName,
                }, {
                    $set: {
                        assignedDate,
                        inUnit: unit,
                        assignedMarkingPeriod,
                        assignedSections,
                        pageNumbers,
                        linkedCourseIds,
                        assignedSectionIdList,
                        vocabList,
                        beforeActivity,
                        duringActivities,
                        afterActivity,
                        questionList,
                        essentialQuestion,
                    },
                });
            }
            const lessons = [];
            for (const _id in linkedCourseIds) {
                const lesson = yield lessonData.findOne({
                    'assignedCourse._id': new mongodb_1.ObjectId(linkedCourseIds[_id]),
                    lessonName,
                });
                lessons.unshift(lesson);
            }
            return { lessons };
        });
    },
});
//# sourceMappingURL=updateLesson.js.map