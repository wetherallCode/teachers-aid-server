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
exports.ChangeVocabWordInput = schema_1.inputObjectType({
    name: 'ChangeVocabWordInput',
    definition(t) {
        t.id('_id', { required: true });
        t.string('word', { required: true });
        t.string('newWord', { required: true });
        t.string('definition', { required: true });
        t.string('newDefinition', { required: true });
    },
});
exports.ChangeVocabWordPayload = schema_1.objectType({
    name: 'UpdateVocabPayload',
    definition(t) {
        t.field('textSection', { type: textSection_1.TextSection });
    },
});
exports.ChangeVocabWord = schema_1.mutationField('changeVocabWord', {
    type: exports.ChangeVocabWordPayload,
    args: { input: schema_1.arg({ type: exports.ChangeVocabWordInput, required: true }) },
    resolve(_, { input: { _id, newWord, word, definition, newDefinition } }, { textData }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield textData.updateOne({
                _id: new mongodb_1.ObjectID(_id),
                hasVocab: { $elemMatch: { word: word, definition: definition } },
            }, {
                $set: {
                    'hasVocab.$.word': newWord,
                    'hasVocab.$.definition': newDefinition,
                },
            });
            const textSection = yield textData.findOne({ _id: new mongodb_1.ObjectID(_id) });
            return { textSection };
        });
    },
});
//# sourceMappingURL=changeVocabWord.js.map