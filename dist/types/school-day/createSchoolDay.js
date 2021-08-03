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
exports.CreateSchoolDay = exports.CreateSchoolDayPayload = exports.CreateSchoolDayInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const __1 = require("..");
exports.CreateSchoolDayInput = schema_1.inputObjectType({
    name: 'CreateSchoolDayInput',
    definition(t) {
        t.field('currentSchoolDayType', { type: _1.SchoolDayType, required: true });
        t.int('schoolDayCount', { required: true });
        t.field('cohortWeek', { type: __1.StudentCohortEnum, required: true });
    },
});
exports.CreateSchoolDayPayload = schema_1.objectType({
    name: 'CreateSchoolDayPayload',
    definition(t) {
        t.field('schoolDay', { type: _1.SchoolDay });
    },
});
exports.CreateSchoolDay = schema_1.mutationField('createSchoolDay', {
    type: exports.CreateSchoolDayPayload,
    args: { input: schema_1.arg({ type: exports.CreateSchoolDayInput, required: true }) },
    resolve(_, { input: { currentSchoolDayType, schoolDayCount, cohortWeek } }, { schoolDayData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newSchoolDay = {
                cohortWeek,
                currentSchoolDayType,
                schoolDayCount,
                todaysDate: new Date().toLocaleDateString(),
                signInSheets: [],
            };
            const { insertedId } = yield schoolDayData.insertOne(newSchoolDay);
            newSchoolDay._id = insertedId;
            yield schoolDayData.updateOne({ schoolDayTracker: { $exists: true } }, {
                $set: {
                    schoolDayTracker: schoolDayCount,
                    cohortWeekTracker: cohortWeek,
                    schoolDayTypeTracker: currentSchoolDayType,
                },
            });
            return { schoolDay: newSchoolDay };
        });
    },
});
//# sourceMappingURL=createSchoolDay.js.map