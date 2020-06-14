"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
const courses_1 = require("../courses");
const general_1 = require("../general");
const textSections_1 = require("../textSections");
const lessonTextSections_1 = require("./lessonTextSections");
const units_1 = require("../units");
exports.Lesson = schema_1.objectType({
    name: 'Lesson',
    definition(t) {
        t.id('_id', { nullable: true });
        t.string('lessonName');
        t.date('assignedDate');
        t.field('inUnit', { type: units_1.Unit });
        t.field('assignedMarkingPeriod', { type: general_1.MarkingPeriodEnum });
        t.field('assignedCourse', { type: courses_1.Course });
        t.field('pageNumbers', { type: textSections_1.PageNumbers });
        t.list.id('linkedCourseIds');
        t.field('assignedSections', { type: lessonTextSections_1.LessonTextSections });
        t.list.id('assignedSectionIdList');
        t.list.field('vocabList', { type: textSections_1.TextSectionVocab });
        t.field('beforeActivity', { type: textSections_1.TextSectionProtocols });
        t.list.field('duringActivities', { type: textSections_1.TextSectionProtocols });
        t.field('afterActivity', { type: textSections_1.TextSectionProtocols });
        t.list.field('questionList', { type: textSections_1.TextSectionQuestions });
        t.string('essentialQuestion');
        t.string('objectives', { nullable: true });
    },
});
//# sourceMappingURL=lesson.js.map