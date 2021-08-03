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
exports.FindTexts = exports.FindTextsPayload = void 0;
const schema_1 = require("@nexus/schema");
const text_1 = require("./text");
exports.FindTextsPayload = schema_1.objectType({
    name: 'FindTextsPayload',
    definition(t) {
        t.list.field('texts', { type: text_1.Text });
    },
});
exports.FindTexts = schema_1.queryField('findTexts', {
    type: exports.FindTextsPayload,
    resolve(_, __, { textData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const texts = yield textData
                .find({ textTitle: { $exists: true } })
                .toArray();
            return { texts };
        });
    },
});
//# sourceMappingURL=findTexts.js.map