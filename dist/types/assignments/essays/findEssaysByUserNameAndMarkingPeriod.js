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
exports.FindEssaysByUserNameAndMarkingPeriod = exports.FindEssaysByUserNameAndMarkingPeriodPayload = exports.FindEssaysByUserNameAndMarkingPeriodInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const general_1 = require("../../general");
exports.FindEssaysByUserNameAndMarkingPeriodInput = schema_1.inputObjectType({
    name: 'FindEssaysByUserNameAndMarkingPeriodInput',
    definition(t) {
        t.string('userName', { required: true });
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum, required: true });
    },
});
exports.FindEssaysByUserNameAndMarkingPeriodPayload = schema_1.objectType({
    name: 'FindEssaysByUserNameAndMarkingPeriodPayload',
    definition(t) {
        t.list.field('essay', { type: _1.Essay, nullable: true });
    },
});
exports.FindEssaysByUserNameAndMarkingPeriod = schema_1.queryField('findEssaysByUserNameAndMarkingPeriod', {
    type: exports.FindEssaysByUserNameAndMarkingPeriodPayload,
    args: {
        input: schema_1.arg({
            type: exports.FindEssaysByUserNameAndMarkingPeriodInput,
            required: true,
        }),
    },
    resolve(_, { input: { userName, markingPeriod } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essay = yield assignmentData
                .find({
                'hasOwner.userName': userName,
                markingPeriod,
                workingDraft: { $exists: true },
            })
                .toArray();
            return { essay };
        });
    },
});
//# sourceMappingURL=findEssaysByUserNameAndMarkingPeriod.js.map