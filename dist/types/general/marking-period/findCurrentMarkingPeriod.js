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
exports.FindCurrentMarkingPeriod = exports.FindCurrentMarkingPeriodPayload = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
exports.FindCurrentMarkingPeriodPayload = schema_1.objectType({
    name: 'FindCurrentMarkingPeriodPayload',
    definition(t) {
        t.field('markingPeriod', { type: __1.MarkingPeriod });
    },
});
exports.FindCurrentMarkingPeriod = schema_1.queryField('findCurrentMarkingPeriod', {
    type: exports.FindCurrentMarkingPeriodPayload,
    resolve(_, __, { generalData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const markingPeriod = yield generalData.findOne({
                currentMarkingPeriod: { $exists: true },
            });
            return { markingPeriod };
        });
    },
});
//# sourceMappingURL=findCurrentMarkingPeriod.js.map