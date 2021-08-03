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
exports.FindChaptersInText = exports.FindChaptersInTextPayload = exports.FindChaptersInTextInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
exports.FindChaptersInTextInput = schema_1.inputObjectType({
    name: 'FindChaptersInTextInput',
    definition(t) {
        t.string('textTitle', { required: true });
    },
});
exports.FindChaptersInTextPayload = schema_1.objectType({
    name: 'FindChaptersInTextPayload',
    definition(t) {
        t.list.field('chapters', { type: _1.Chapter });
    },
});
exports.FindChaptersInText = schema_1.queryField('findChaptersInText', {
    type: exports.FindChaptersInTextPayload,
    args: { input: schema_1.arg({ type: exports.FindChaptersInTextInput, required: true }) },
    resolve(_, { input: { textTitle } }, { textData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const chapters = yield textData
                .find({ 'fromText.textTitle': textTitle })
                .toArray();
            return { chapters };
        });
    },
});
//# sourceMappingURL=findChaptersInText.js.map