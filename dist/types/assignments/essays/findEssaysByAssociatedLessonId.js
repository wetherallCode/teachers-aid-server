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
exports.FindEssaysByAssociatedLessonId = exports.FindEssaysByAssociatedLessonIdPayload = exports.FindEssaysByAssociatedLessonIdInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
exports.FindEssaysByAssociatedLessonIdInput = schema_1.inputObjectType({
    name: 'FindEssaysByAssociatedLessonIdInput',
    definition(t) {
        t.id('associatedLessonId', { required: true });
    },
});
exports.FindEssaysByAssociatedLessonIdPayload = schema_1.objectType({
    name: 'FindEssaysByAssociatedLessonIdPayload',
    definition(t) {
        t.list.field('essays', { type: _1.Essay });
    },
});
exports.FindEssaysByAssociatedLessonId = schema_1.queryField('findEssaysByAssociatedLessonId', {
    type: exports.FindEssaysByAssociatedLessonIdPayload,
    args: {
        input: schema_1.arg({ type: exports.FindEssaysByAssociatedLessonIdInput, required: true }),
    },
    resolve(_, { input: { associatedLessonId } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essays = yield assignmentData
                .find({
                associatedLessonId,
                workingDraft: { $exists: true },
            })
                .toArray();
            return { essays };
        });
    },
});
//# sourceMappingURL=findEssaysByAssociatedLessonId.js.map