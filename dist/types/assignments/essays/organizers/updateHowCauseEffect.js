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
exports.UpdateHowCauseEffect = exports.UpdateHowCauseEffectPayload = exports.UpdateHowCauseEffectInput = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const mongodb_1 = require("mongodb");
exports.UpdateHowCauseEffectInput = schema_1.inputObjectType({
    name: 'UpdateHowCauseEffectInput',
    definition(t) {
        t.id('essayId', { required: true });
        t.string('before', { required: true });
        t.string('cause', { required: true });
        t.string('after', { required: true });
    },
});
exports.UpdateHowCauseEffectPayload = schema_1.objectType({
    name: 'UpdateHowCauseEffectPayload',
    definition(t) {
        t.field('essay', { type: __1.Essay });
    },
});
exports.UpdateHowCauseEffect = schema_1.mutationField('updateHowCauseEffect', {
    type: exports.UpdateHowCauseEffectPayload,
    args: { input: schema_1.arg({ type: exports.UpdateHowCauseEffectInput, required: true }) },
    resolve(_, { input: { essayId, before, cause, after } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const questionTypeCheck = yield assignmentData.findOne({ _id: new mongodb_1.ObjectId(essayId) });
            const { questionType } = questionTypeCheck.workingDraft
                .organizer;
            if (questionTypeCheck.workingDraft.organizer.hasOwnProperty('questionType')) {
                if (questionType === 'HOW_CAUSE_EFFECT') {
                    yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(essayId) }, {
                        $set: {
                            'workingDraft.organizer.answerType.before': before,
                            'workingDraft.organizer.answerType.cause': cause,
                            'workingDraft.organizer.answerType.after': after,
                        },
                    });
                    const essay = yield assignmentData.findOne({
                        _id: new mongodb_1.ObjectId(essayId),
                    });
                    return { essay };
                }
                else
                    throw new Error('Wrong answerType');
            }
            else
                throw new Error('There is not question type selected');
        });
    },
});
//# sourceMappingURL=updateHowCauseEffect.js.map