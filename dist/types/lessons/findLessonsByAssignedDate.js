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
exports.FindLessonsByAssignedDate = exports.FindLessonsByAssignedDatePayload = exports.FindLessonsByAssignedDateInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
exports.FindLessonsByAssignedDateInput = schema_1.inputObjectType({
    name: 'FindLessonsByAssignedDateInput',
    definition(t) {
        t.string('assignedDate', { required: true });
    },
});
exports.FindLessonsByAssignedDatePayload = schema_1.objectType({
    name: 'FindLessonsByAssignedDatePayload',
    definition(t) {
        t.list.field('lessons', { type: _1.Lesson, nullable: true });
    },
});
exports.FindLessonsByAssignedDate = schema_1.queryField('findLessonsByAssignedDate', {
    type: exports.FindLessonsByAssignedDatePayload,
    args: {
        input: schema_1.arg({ type: exports.FindLessonsByAssignedDateInput, required: true }),
    },
    resolve(_, { input: { assignedDate } }, { lessonData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessons = yield lessonData
                .find({ assignedDate })
                .toArray();
            return { lessons: lessons };
        });
    },
});
//# sourceMappingURL=findLessonsByAssignedDate.js.map