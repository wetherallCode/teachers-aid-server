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
exports.FindTextSectionsByIdInput = schema_1.inputObjectType({
    name: 'FindTextSectionsByIdInput',
    definition(t) {
        t.list.id('_ids', { required: true });
    },
});
exports.FindTextSectionsByIdPayload = schema_1.objectType({
    name: 'FindTextSectionsByIdPayload',
    definition(t) {
        t.list.field('textSections', { type: _1.TextSection });
    },
});
exports.FindTextSectionsById = schema_1.queryField('findTextSectionsById', {
    type: exports.FindTextSectionsByIdPayload,
    args: { input: schema_1.arg({ type: exports.FindTextSectionsByIdInput, required: true }) },
    resolve(_, { input: { _ids } }, { textData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const textSections = [];
            for (const _id in _ids) {
                const section = yield textData.findOne({ _id: new mongodb_1.ObjectId(_ids[_id]) });
                textSections.push(section);
            }
            return { textSections };
        });
    },
});
//# sourceMappingURL=findTextSectionsById.js.map