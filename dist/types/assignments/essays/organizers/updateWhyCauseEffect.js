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
exports.UpdateWhyCauseEffect = exports.UpdateWhyCauseEffectPayload = exports.UpdateWhyCauseEffectInput = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const mongodb_1 = require("mongodb");
exports.UpdateWhyCauseEffectInput = schema_1.inputObjectType({
    name: 'UpdateWhyCauseEffectInput',
    definition(t) {
        t.id('essayId', { required: true });
        t.string('ultimateCause', { required: true });
        t.string('proximateCause', { required: true });
    },
});
exports.UpdateWhyCauseEffectPayload = schema_1.objectType({
    name: 'UpdateWhyCauseEffectPayload',
    definition(t) {
        t.field('essay', { type: __1.Essay });
    },
});
exports.UpdateWhyCauseEffect = schema_1.mutationField('updateWhyCauseEffect', {
    type: exports.UpdateWhyCauseEffectPayload,
    args: { input: schema_1.arg({ type: exports.UpdateWhyCauseEffectInput, required: true }) },
    resolve(_, { input: { essayId, ultimateCause, proximateCause } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const questionTypeCheck = yield assignmentData.findOne({ _id: new mongodb_1.ObjectId(essayId) });
            const { questionType } = questionTypeCheck.workingDraft
                .organizer;
            if (questionTypeCheck.workingDraft.organizer.hasOwnProperty('questionType')) {
                if (questionType === 'WHY_CAUSE_EFFECT') {
                    yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(essayId) }, {
                        $set: {
                            'workingDraft.organizer.answerType.ultimateCause': ultimateCause,
                            'workingDraft.organizer.answerType.proximateCause': proximateCause,
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
//# sourceMappingURL=updateWhyCauseEffect.js.map