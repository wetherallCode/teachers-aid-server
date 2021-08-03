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
exports.TimeOfDayEnum = exports.Readings = exports.Score = exports.HasAssigner = exports.HasOwnerInput = exports.Assignment = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const general_1 = require("../general");
const mongodb_1 = require("mongodb");
exports.Assignment = schema_1.interfaceType({
    name: 'Assignment',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('hasOwner', { type: __1.Student });
        t.field('hasAssigner', { type: __1.Teacher });
        t.field('score', { type: exports.Score });
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum });
        t.id('associatedLessonId', { nullable: true });
        t.field('lessonInfo', {
            type: __1.Lesson,
            resolve(parent, __, { lessonData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const lessonInfo = lessonData.findOne({
                        _id: new mongodb_1.ObjectId(parent.associatedLessonId),
                    });
                    return lessonInfo;
                });
            },
        });
        t.string('dueTime');
        t.string('assignedDate');
        t.boolean('paperBased');
        t.boolean('assigned');
        t.string('dueDate');
        t.boolean('late');
        t.boolean('exempt');
        t.field('readings', { type: exports.Readings });
        t.resolveType((assignment) => {
            if (assignment.hasOwnProperty('topic')) {
                return 'Essay';
            }
            return 'ReadingGuide';
        });
    },
});
exports.HasOwnerInput = schema_1.inputObjectType({
    name: 'HasOwnerInput',
    definition(t) {
        t.string('ownerUserName');
    },
});
exports.HasAssigner = schema_1.inputObjectType({
    name: 'HasAssigner',
    definition(t) {
        t.string('assignerUserName');
    },
});
exports.Score = schema_1.objectType({
    name: 'Score',
    definition(t) {
        t.float('earnedPoints');
        t.int('maxPoints');
    },
});
exports.Readings = schema_1.objectType({
    name: 'Readings',
    definition(t) {
        t.string('readingPages');
        t.string('readingSections');
    },
});
exports.TimeOfDayEnum = schema_1.enumType({
    name: 'TimeOfDay',
    members: ['BEFORE_SCHOOL', 'BEFORE_CLASS', 'AFTER_CLASS', 'AFTER_SCHOOL'],
});
//# sourceMappingURL=assignments.js.map