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
const texts_1 = require("../texts");
exports.FindTextByTitleInput = schema_1.inputObjectType({
    name: 'FindTextByTitleInput',
    definition(t) {
        t.string('title');
    },
});
exports.FindTextByTitlePayload = schema_1.objectType({
    name: 'FindTextByTitlePayload',
    definition(t) {
        t.field('text', { type: texts_1.Text });
    },
});
exports.FindTextByTitle = schema_1.queryField('findTextByTitle', {
    type: exports.FindTextByTitlePayload,
    args: { input: schema_1.arg({ type: exports.FindTextByTitleInput, required: true }) },
    resolve(_, { input: { title } }, { textData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = yield textData.findOne({ title });
            return { text };
        });
    },
});
//# sourceMappingURL=findTextByTitle.js.map