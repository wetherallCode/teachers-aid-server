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
exports.FindUnitsPayload = schema_1.objectType({
    name: 'FindUnitsPayload',
    definition(t) {
        t.list.field('units', { type: _1.Unit });
    },
});
exports.FindUnits = schema_1.queryField('findUnits', {
    type: exports.FindUnitsPayload,
    resolve(_, __, { lessonData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const units = yield lessonData
                .find({ unitName: { $exists: true } })
                .toArray();
            return { units };
        });
    },
});
//# sourceMappingURL=findUnits.js.map