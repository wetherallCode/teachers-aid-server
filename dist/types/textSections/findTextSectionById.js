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
const textSection_1 = require("./textSection");
const mongodb_1 = require("mongodb");
exports.FindTextSectionByIdInput = schema_1.inputObjectType({
    name: 'FindTextSectionByIdInput',
    definition(t) {
        t.id('_id', { required: true });
    },
});
exports.FindTextSectionByIdPayload = schema_1.objectType({
    name: 'FindTextSectionByIdPayload',
    definition(t) {
        t.field('textSection', { type: textSection_1.TextSection });
    },
});
exports.FindTextSectionById = schema_1.queryField('findTextSectionById', {
    type: exports.FindTextSectionByIdPayload,
    args: { input: schema_1.arg({ type: exports.FindTextSectionByIdInput, required: true }) },
    resolve(_, { input: { _id } }, { textData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const textSection = yield textData.findOne({
                _id: new mongodb_1.ObjectID(_id),
            });
            return { textSection };
        });
    },
});
//# sourceMappingURL=findTextSectionById.js.map