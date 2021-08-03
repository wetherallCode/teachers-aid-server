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
exports.AddNewText = exports.AddNewTextPayload = exports.AddNewTextInput = void 0;
const schema_1 = require("@nexus/schema");
const texts_1 = require("../texts");
exports.AddNewTextInput = schema_1.inputObjectType({
    name: 'AddNewTextInput',
    definition(t) {
        t.string('textTitle', { required: true });
        t.id('ownerId', { required: true });
    },
});
exports.AddNewTextPayload = schema_1.objectType({
    name: 'AddNewTextPayload',
    definition(t) {
        t.field('text', { type: texts_1.Text });
    },
});
exports.AddNewText = schema_1.mutationField('addNewText', {
    type: exports.AddNewTextPayload,
    args: { input: schema_1.arg({ type: exports.AddNewTextInput, required: true }) },
    resolve(_, { input: { textTitle, ownerId } }, { textData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newText = {
                ownerId,
                textTitle,
            };
            const { insertedId } = yield textData.insertOne(newText);
            newText._id = insertedId;
            return { text: newText };
        });
    },
});
//# sourceMappingURL=addNewText.js.map