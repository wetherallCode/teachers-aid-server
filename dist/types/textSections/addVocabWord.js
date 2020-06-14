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
const mongodb_1 = require("mongodb");
exports.AddVocabWordInput = schema_1.inputObjectType({
    name: 'AddVocabWordInput',
    definition(t) {
        t.id('_id', { required: true });
        t.string('word', { required: true });
        t.string('definition', { required: true });
        t.int('position', { required: true });
    },
});
exports.AddVocabWordPayload = schema_1.objectType({
    name: 'AddVocabWordPayload',
    definition(t) {
        t.field('textSection', { type: _1.TextSection });
    },
});
exports.AddVocabWord = schema_1.mutationField('addVocabWord', {
    type: exports.AddVocabWordPayload,
    args: { input: schema_1.arg({ type: exports.AddVocabWordInput, required: true }) },
    resolve(_, { input: { _id, word, definition, position } }, { textData }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield textData.updateOne({ _id: new mongodb_1.ObjectID(_id) }, {
                $push: {
                    hasVocab: { $each: [{ word, definition }], $position: position },
                },
            });
            const textSection = yield textData.findOne({ _id: new mongodb_1.ObjectID(_id) });
            return { textSection };
        });
    },
});
//# sourceMappingURL=addVocabWord.js.map