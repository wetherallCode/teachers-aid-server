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
exports.RemoveTextSection = exports.RemoveTextSectionPayload = exports.RemoveTextSectionInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
exports.RemoveTextSectionInput = schema_1.inputObjectType({
    name: 'RemoveTextSectionInput',
    definition(t) {
        t.id('_id', { required: true });
    },
});
exports.RemoveTextSectionPayload = schema_1.objectType({
    name: 'RemoveTextSectionPayload',
    definition(t) {
        t.boolean('removed');
    },
});
exports.RemoveTextSection = schema_1.mutationField('removeTextSection', {
    type: exports.RemoveTextSectionPayload,
    args: { input: schema_1.arg({ type: exports.RemoveTextSectionInput, required: true }) },
    resolve(_, { input: { _id } }, { textData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const doesTextSectionExist = yield textData.findOne({
                _id: new mongodb_1.ObjectID(_id),
            });
            if (doesTextSectionExist) {
                const { deletedCount } = yield textData.deleteOne({
                    _id: new mongodb_1.ObjectID(_id),
                });
                if (deletedCount === 1) {
                    return { removed: true };
                }
                else
                    throw new Error('Something went wrong');
            }
            else
                throw new Error('Text Section does not exist!');
        });
    },
});
//# sourceMappingURL=removeTextSection.js.map