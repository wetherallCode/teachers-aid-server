"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolDayTracker = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("../..");
exports.SchoolDayTracker = schema_1.objectType({
    name: 'SchoolDayTracker',
    definition(t) {
        t.id('_id', { nullable: true });
        t.int('schoolDayTracker');
        t.field('schoolDayTypeTracker', { type: __1.SchoolDayType });
        t.field('cohortWeekTracker', { type: __1.StudentCohortEnum });
    },
});
//# sourceMappingURL=schoolDayTracker.js.map