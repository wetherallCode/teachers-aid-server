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
exports.Text = schema_1.objectType({
    name: 'Text',
    definition(t) {
        t.id('_id', { nullable: true });
        t.string('textTitle');
        t.id('ownerId');
        t.list.field('hasChapters', {
            type: _1.Chapter,
            resolve(parent, __, { textData }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const chapters = yield textData
                        .find({ 'fromText.textTitle': parent.textTitle })
                        .toArray();
                    return chapters;
                });
            },
        });
    },
});
exports.TextInput = schema_1.inputObjectType({
    name: 'TextInput',
    definition(t) {
        t.string('textTitle', { required: true });
        t.list.string('chapters', { required: true });
    },
});
//# sourceMappingURL=text.js.map