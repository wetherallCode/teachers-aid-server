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
const mongodb_1 = require("mongodb");
exports.RemoveLatenessInput = schema_1.inputObjectType({
    name: 'RemoveLatenessInput',
    definition(t) {
        t.id('_id', { required: true });
    },
});
exports.RemoveLatenessPayload = schema_1.objectType({
    name: 'RemoveLatenessPayload',
    definition(t) {
        t.boolean('removed');
    },
});
exports.RemoveLateness = schema_1.mutationField('removeLateness', {
    type: exports.RemoveLatenessPayload,
    args: { input: schema_1.arg({ type: exports.RemoveLatenessInput, required: true }) },
    resolve(_, { input: { _id } }, { studentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const lateness = yield studentData.findOne({ _id: new mongodb_1.ObjectId(_id) });
            if (lateness) {
                const returnedValue = yield studentData.deleteOne({
                    _id: new mongodb_1.ObjectId(_id),
                });
                return { removed: returnedValue.deletedCount > 0 };
            }
            else
                return { removed: false };
        });
    },
});
//# sourceMappingURL=removeLateness.js.map