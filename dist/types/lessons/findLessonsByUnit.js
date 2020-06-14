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
exports.FindLessonsByUnitInput = schema_1.inputObjectType({
    name: 'FindLessonsByUnitInput',
    definition(t) {
        t.id('unitId', { required: true });
        t.id('courseId', { required: true });
    },
});
exports.FindLessonsByUnitPayload = schema_1.objectType({
    name: 'FindLessonsByUnitPayload',
    definition(t) {
        t.list.field('lessons', { type: _1.Lesson });
    },
});
exports.FindLessonsByUnit = schema_1.queryField('findLessonsByUnit', {
    type: exports.FindLessonsByUnitPayload,
    args: { input: schema_1.arg({ type: exports.FindLessonsByUnitInput, required: true }) },
    resolve(_, { input: { unitId, courseId } }, { lessonData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessons = yield lessonData
                .find({
                'inUnit._id': new mongodb_1.ObjectId(unitId),
                'assignedCourse._id': new mongodb_1.ObjectId(courseId),
            })
                .toArray();
            return { lessons };
        });
    },
});
//# sourceMappingURL=findLessonsByUnit.js.map