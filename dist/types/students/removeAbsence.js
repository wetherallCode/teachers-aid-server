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
exports.RemoveAbsence = exports.RemoveAbsencePayload = exports.RemoveAbsenceInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
exports.RemoveAbsenceInput = schema_1.inputObjectType({
    name: 'RemoveAbsenceInput',
    definition(t) {
        t.id('_id', { required: true });
    },
});
exports.RemoveAbsencePayload = schema_1.objectType({
    name: 'RemoveAbsencePayload',
    definition(t) {
        t.boolean('removed');
    },
});
exports.RemoveAbsence = schema_1.mutationField('removeAbsence', {
    type: exports.RemoveAbsencePayload,
    args: { input: schema_1.arg({ type: exports.RemoveAbsenceInput, required: true }) },
    resolve(_, { input: { _id } }, { studentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const absence = yield studentData.findOne({ _id: new mongodb_1.ObjectId(_id) });
            if (absence) {
                const { deletedCount } = yield studentData.deleteOne({
                    _id: new mongodb_1.ObjectId(_id),
                });
                if (deletedCount === 1) {
                    return { removed: true };
                }
                throw new Error('Something went wrong');
            }
            else
                throw new Error('Absence does not exist!');
        });
    },
});
//# sourceMappingURL=removeAbsence.js.map