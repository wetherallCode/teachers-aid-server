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
const markingPeriod_1 = require("./markingPeriod");
exports.SetCurrentMarkingPeriodInput = schema_1.inputObjectType({
    name: 'SetCurrentMarkingPeriodInput',
    definition(t) {
        t.field('currentMarkingPeriod', { type: markingPeriod_1.MarkingPeriodEnum, required: true });
    },
});
exports.SetCurrentMarkingPeriodPayload = schema_1.objectType({
    name: 'SetCurrentMarkingPeriodPayload',
    definition(t) {
        t.field('markingPeriod', { type: markingPeriod_1.MarkingPeriod });
    },
});
exports.SetCurrentMarkingPeriod = schema_1.mutationField('setCurrentMarkingPeriod', {
    type: exports.SetCurrentMarkingPeriodPayload,
    args: {
        input: schema_1.arg({ type: exports.SetCurrentMarkingPeriodInput, required: true }),
    },
    resolve(_, { input: { currentMarkingPeriod } }, { generalData }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield generalData.updateOne({
                currentMarkingPeriod: { $exists: true },
            }, {
                $set: { currentMarkingPeriod },
            });
            const markingPeriod = yield generalData.findOne({
                currentMarkingPeriod: { $exists: true },
            });
            return { markingPeriod };
        });
    },
});
//# sourceMappingURL=setCurrentMarkingPeriod.js.map