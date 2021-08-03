"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organizers = void 0;
const schema_1 = require("@nexus/schema");
exports.Organizers = schema_1.unionType({
    name: 'Organizers',
    definition(t) {
        t.members('DevelopingOrganizer', 'AcademicOrganizer', 'AdvancedOrganizer');
        t.resolveType((organizer) => {
            if (organizer.hasOwnProperty('academicSentenceStructure')) {
                return 'AcademicOrganizer';
            }
            if (organizer.hasOwnProperty('developingSentenceStructure')) {
                return 'DevelopingOrganizer';
            }
            return 'AdvancedOrganizer';
        });
    },
});
//# sourceMappingURL=organizers.js.map