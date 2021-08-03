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
exports.CreateLesson = exports.CreateLessonPayload = exports.CreateLessonInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const general_1 = require("../general");
const textSections_1 = require("../textSections");
const mongodb_1 = require("mongodb");
exports.CreateLessonInput = schema_1.inputObjectType({
    name: 'CreateLessonInput',
    definition(t) {
        t.date('assignedDate', { required: true });
        t.id('inUnit', { required: true });
        t.field('assignedMarkingPeriod', {
            type: general_1.MarkingPeriodEnum,
            required: true,
        });
        t.list.id('assignedCourses', { required: true });
        t.string('lessonName', { required: true });
        t.field('assignedSections', {
            type: _1.LessonTextSectionsInput,
            required: true,
        });
        t.field('pageNumbers', { type: textSections_1.PageNumbersInput, required: true });
        t.list.id('assignedSectionIdList', { required: true });
        t.list.field('vocabList', { type: textSections_1.TextSectionVocabInput, required: true });
        t.field('beforeActivity', {
            type: textSections_1.TextSectionProtocolsInput,
            required: true,
        });
        t.list.field('duringActivities', {
            type: textSections_1.TextSectionProtocolsInput,
            required: true,
        });
        t.field('afterActivity', {
            type: textSections_1.TextSectionProtocolsInput,
            required: true,
        });
        t.list.field('questionList', {
            type: textSections_1.TextSectionQuestionsInput,
            required: true,
        });
        t.string('essentialQuestion', { required: true });
    },
});
exports.CreateLessonPayload = schema_1.objectType({
    name: 'CreateLessonPayload',
    definition(t) {
        t.list.field('lessons', { type: _1.Lesson });
    },
});
exports.CreateLesson = schema_1.mutationField('createLesson', {
    type: exports.CreateLessonPayload,
    args: { input: schema_1.arg({ type: exports.CreateLessonInput, required: true }) },
    resolve(_, { input: { assignedDate, inUnit, lessonName, assignedMarkingPeriod, assignedCourses, pageNumbers, assignedSections, assignedSectionIdList, vocabList, beforeActivity, duringActivities, afterActivity, questionList, essentialQuestion, }, }, { lessonData, courseData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = yield lessonData.findOne({ _id: new mongodb_1.ObjectId(inUnit) });
            const lessons = [];
            for (const courseId of assignedCourses) {
                const course = yield courseData.findOne({
                    _id: new mongodb_1.ObjectId(courseId),
                });
                const lesson = {
                    assignedDate,
                    inUnit: unit,
                    assignedMarkingPeriod,
                    lessonName,
                    pageNumbers,
                    assignedCourses: [course],
                    assignedSections,
                    assignedSectionIdList,
                    vocabList,
                    beforeActivity,
                    duringActivities,
                    afterActivity,
                    essentialQuestion,
                    questionList,
                    objectives: null,
                    dynamicLesson: 'OFF',
                };
                const { insertedId } = yield lessonData.insertOne(lesson);
                lesson._id = insertedId;
                lessons.push(lesson);
            }
            return { lessons };
        });
    },
});
//# sourceMappingURL=createLesson.js.map