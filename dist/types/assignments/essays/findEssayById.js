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
exports.FindEssayById = exports.FindEssayByIdPayload = exports.FindEssayByIdInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.FindEssayByIdInput = schema_1.inputObjectType({
    name: 'FindEssayByIdInput',
    definition(t) {
        t.id('_id', { required: true });
    },
});
exports.FindEssayByIdPayload = schema_1.objectType({
    name: 'FindEssayByIdPayload',
    definition(t) {
        t.field('essay', { type: _1.Essay });
    },
});
exports.FindEssayById = schema_1.queryField('findEssayById', {
    type: exports.FindEssayByIdPayload,
    args: { input: schema_1.arg({ type: exports.FindEssayByIdInput, required: true }) },
    resolve(_, { input: { _id } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essay = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectID(_id),
            });
            return { essay };
        });
    },
});
//# sourceMappingURL=findEssayById.js.map