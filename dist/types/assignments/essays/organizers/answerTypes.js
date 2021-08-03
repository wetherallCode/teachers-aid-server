"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhyCauseEffectAnswerType = exports.HowCauseEffectAnswerType = exports.ProblemSolutionAnswerType = exports.AnswerTypes = void 0;
const schema_1 = require("@nexus/schema");
exports.AnswerTypes = schema_1.unionType({
    name: 'AnswerTypes',
    definition(t) {
        t.members('ProblemSolutionAnswerType', 'HowCauseEffectAnswerType', 'WhyCauseEffectAnswerType');
        t.resolveType((type) => {
            if (type.hasOwnProperty('problem')) {
                return 'ProblemSolutionAnswerType';
            }
            if (type.hasOwnProperty('before')) {
                return 'HowCauseEffectAnswerType';
            }
            return 'WhyCauseEffectAnswerType';
        });
    },
});
exports.ProblemSolutionAnswerType = schema_1.objectType({
    name: 'ProblemSolutionAnswerType',
    definition(t) {
        t.string('problem');
        t.string('reasonForProblem');
        t.string('solvedBy');
        t.string('whySolutionSolved');
    },
});
exports.HowCauseEffectAnswerType = schema_1.objectType({
    name: 'HowCauseEffectAnswerType',
    definition(t) {
        t.string('before');
        t.string('cause');
        t.string('after');
    },
});
exports.WhyCauseEffectAnswerType = schema_1.objectType({
    name: 'WhyCauseEffectAnswerType',
    definition(t) {
        t.string('ultimateCause');
        t.string('proximateCause');
    },
});
//# sourceMappingURL=answerTypes.js.map