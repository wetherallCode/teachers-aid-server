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
exports.FindEssayByStudentIdAndLessonId = exports.FindEssayByStudentIdAndLessonIdPayload = exports.FindEssayByStudentIdAndLessonIdInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
exports.FindEssayByStudentIdAndLessonIdInput = schema_1.inputObjectType({
    name: 'FindEssayByStudentIdAndLessonIdInput',
    definition(t) {
        t.id('studentId', { required: true });
        t.id('lessonId');
    },
});
exports.FindEssayByStudentIdAndLessonIdPayload = schema_1.objectType({
    name: 'FindEssayByStudentIdAndLessonIdPayload',
    definition(t) {
        t.field('essay', { type: _1.Essay });
    },
});
exports.FindEssayByStudentIdAndLessonId = schema_1.queryField('findEssayByStudentIdAndLessonId', {
    type: exports.FindEssayByStudentIdAndLessonIdPayload,
    args: {
        input: schema_1.arg({
            type: exports.FindEssayByStudentIdAndLessonIdInput,
            required: true,
        }),
    },
    resolve(_, { input: { studentId, lessonId } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essay = yield assignmentData.findOne({
                'hasOwner._id': studentId,
                associatedLessonId: lessonId,
                workingDraft: { $exists: true },
            });
            return { essay };
        });
    },
});
//# sourceMappingURL=findEssayByStudentIdAndLessonId.js.map