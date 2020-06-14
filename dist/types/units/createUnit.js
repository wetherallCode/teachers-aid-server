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
exports.CreateUnitInput = schema_1.inputObjectType({
    name: 'CreateUnitInput',
    definition(t) {
        t.string('unitName', { required: true });
    },
});
exports.CreateUnitPayload = schema_1.objectType({
    name: 'CreateUnitPayload',
    definition(t) {
        t.field('unit', { type: _1.Unit });
    },
});
exports.CreateUnit = schema_1.mutationField('createUnit', {
    type: exports.CreateUnitPayload,
    args: { input: schema_1.arg({ type: exports.CreateUnitInput, required: true }) },
    resolve(_, { input: { unitName } }, { lessonData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = {
                unitName,
            };
            const { insertedId } = yield lessonData.insertOne(unit);
            unit._id = insertedId;
            return { unit };
        });
    },
});
//# sourceMappingURL=createUnit.js.map