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
exports.UpdateSchoolDay = exports.UpdateSchoolDayPayload = exports.UpdateSchoolDayInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
const __1 = require("..");
exports.UpdateSchoolDayInput = schema_1.inputObjectType({
    name: 'UpdateSchoolDayInput',
    definition(t) {
        t.id('schoolDayId', { required: true });
        t.date('updatedDate', { required: true });
        t.field('updatedCurrentSchoolDayType', {
            type: _1.SchoolDayType,
            required: true,
        });
        t.int('updatedSchoolDayCount', { required: true });
        t.field('updatedCohortWeek', { type: __1.StudentCohortEnum, required: true });
    },
});
exports.UpdateSchoolDayPayload = schema_1.objectType({
    name: 'UpdateSchoolDayPayload',
    definition(t) {
        t.field('schoolDay', { type: _1.SchoolDay });
    },
});
exports.UpdateSchoolDay = schema_1.mutationField('updateSchoolDay', {
    type: exports.UpdateSchoolDayPayload,
    args: { input: schema_1.arg({ type: exports.UpdateSchoolDayInput, required: true }) },
    resolve(_, { input: { schoolDayId, updatedDate, updatedCurrentSchoolDayType, updatedSchoolDayCount, updatedCohortWeek, }, }, { schoolDayData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const schoolDayCheck = yield schoolDayData.findOne({
                _id: new mongodb_1.ObjectId(schoolDayId),
            });
            if (schoolDayCheck) {
                yield schoolDayData.updateOne({ _id: new mongodb_1.ObjectId(schoolDayId) }, {
                    $set: {
                        todaysDate: updatedDate,
                        currentSchoolDayType: updatedCurrentSchoolDayType,
                        schoolDayCount: updatedSchoolDayCount,
                        cohortWeek: updatedCohortWeek,
                    },
                });
                const schoolDay = yield schoolDayData.findOne({
                    _id: new mongodb_1.ObjectId(schoolDayId),
                });
                return { schoolDay };
            }
            else
                throw new Error('School Day does not exist.');
        });
    },
});
//# sourceMappingURL=updateSchoolDay.js.map