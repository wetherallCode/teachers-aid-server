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
exports.UpdateEssayLateness = exports.UpdateEssayLatenessPayload = exports.UpdateEssayLatenessInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.UpdateEssayLatenessInput = schema_1.inputObjectType({
    name: 'UpdateEssayLatenessInput',
    definition(t) {
        t.id('essayId', { required: true });
        t.boolean('lateness', { required: true });
    },
});
exports.UpdateEssayLatenessPayload = schema_1.objectType({
    name: 'UpdateEssayLatenessPayload',
    definition(t) {
        t.field('essay', { type: _1.Essay });
    },
});
exports.UpdateEssayLateness = schema_1.mutationField('updateEssayLateness', {
    type: exports.UpdateEssayLatenessPayload,
    args: { input: schema_1.arg({ type: exports.UpdateEssayLatenessInput, required: true }) },
    resolve(_, { input: { essayId, lateness } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essayValidation = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectId(essayId),
            });
            if (essayValidation) {
                yield assignmentData.updateOne({ _id: new Object(essayId) }, {
                    $set: { late: lateness },
                });
                const essay = yield assignmentData.findOne({ _id: new mongodb_1.ObjectId(essayId) });
                return { essay };
            }
            else
                throw new Error('Essay does not exist');
        });
    },
});
//# sourceMappingURL=updateEssayLateness.js.map