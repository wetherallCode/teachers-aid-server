"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@nexus/schema");
const __1 = require("..");
exports.Assignment = schema_1.interfaceType({
    name: 'Assignment',
    definition(t) {
        t.id('_id', { nullable: true });
        t.field('hasOwner', { type: __1.Student });
        t.field('hasAssigner', { type: __1.Teacher });
        t.field('score', { type: exports.Score });
        t.string('markingPeriod');
        t.id('associatedLessonId');
        t.string('dueTime');
        t.date('assignedDate');
        t.boolean('assigned');
        t.date('dueDate');
        t.boolean('late');
        t.boolean('exempt');
        t.field('readings', { type: exports.Readings });
        t.resolveType((assignment) => {
            if (assignment.hasOwnProperty('topic')) {
                return 'Essay';
            }
            if (assignment.hasOwnProperty('testName')) {
                return 'Test';
            }
            return 'Reading_Guide';
        });
    },
});
exports.HasOwnerInput = schema_1.inputObjectType({
    name: 'HasOwnerInput',
    definition(t) {
        t.string('ownerUserName');
    },
});
exports.HasAssigner = schema_1.inputObjectType({
    name: 'HasAssigner',
    definition(t) {
        t.string('assignerUserName');
    },
});
exports.Score = schema_1.objectType({
    name: 'Score',
    definition(t) {
        t.int('earnedPoints');
        t.int('maxPoints');
    },
});
exports.Readings = schema_1.objectType({
    name: 'Readings',
    definition(t) {
        t.string('readingPages');
        t.string('readingSections');
    },
});
//# sourceMappingURL=assignments.js.map