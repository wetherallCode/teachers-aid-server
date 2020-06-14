"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
const users_1 = require("../users/users");
const __1 = require("..");
exports.Teacher = schema_1.objectType({
    name: 'Teacher',
    definition(t) {
        t.implements(users_1.User);
        t.field('title', { type: exports.TitleEnum });
        t.list.field('teachesCourses', {
            type: __1.Course,
        });
    },
});
exports.TitleEnum = schema_1.enumType({
    name: 'TitleEnum',
    members: ['MR', 'MRS', 'MS', 'MISS'],
});
//# sourceMappingURL=teacher.js.map