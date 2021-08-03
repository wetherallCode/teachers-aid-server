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
exports.RemoveRubricEntry = exports.RemoveRubricEntryPayload = exports.RemoveRubricEntryInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
exports.RemoveRubricEntryInput = schema_1.inputObjectType({
    name: 'RemoveRubricEntryInput',
    definition(t) {
        t.id('rubricEntryId', { required: true });
    },
});
exports.RemoveRubricEntryPayload = schema_1.objectType({
    name: 'RemoveRubricEntryPayload',
    definition(t) {
        t.boolean('removed');
    },
});
exports.RemoveRubricEntry = schema_1.mutationField('removeRubricEntry', {
    type: exports.RemoveRubricEntryPayload,
    args: { input: schema_1.arg({ type: exports.RemoveRubricEntryInput, required: true }) },
    resolve(_, { input: { rubricEntryId } }, { rubricData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const rubricEntry = yield rubricData.findOne({
                _id: new mongodb_1.ObjectId(rubricEntryId),
            });
            if (rubricEntry) {
                const { deletedCount } = yield rubricData.deleteOne({
                    _id: new mongodb_1.ObjectId(rubricEntryId),
                });
                if (deletedCount === 1) {
                    return { removed: true };
                }
                else
                    throw new Error('Something went wrong');
            }
            else
                throw new Error('RubricEntry was not removed');
        });
    },
});
//# sourceMappingURL=removeRubricEntry.js.map