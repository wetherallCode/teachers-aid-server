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
exports.FindSchoolDayByDate = exports.FindSchoolDayByDatePayload = exports.FindSchoolDayByDateInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
exports.FindSchoolDayByDateInput = schema_1.inputObjectType({
    name: 'FindSchoolDayByDateInput',
    definition(t) {
        t.date('date', { required: true });
    },
});
exports.FindSchoolDayByDatePayload = schema_1.objectType({
    name: 'FindSchoolDayByDatePayload',
    definition(t) {
        t.field('schoolDay', { type: _1.SchoolDay, nullable: true });
    },
});
exports.FindSchoolDayByDate = schema_1.queryField('findSchoolDayByDate', {
    type: exports.FindSchoolDayByDatePayload,
    args: { input: schema_1.arg({ type: exports.FindSchoolDayByDateInput, required: true }) },
    resolve(_, { input: { date } }, { schoolDayData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const schoolDay = yield schoolDayData.findOne({ todaysDate: date });
            return { schoolDay };
        });
    },
});
//# sourceMappingURL=findSchoolDayByDate.js.map