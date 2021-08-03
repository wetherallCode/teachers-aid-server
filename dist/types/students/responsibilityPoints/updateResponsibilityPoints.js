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
exports.UpdateResponsibilityPoints = exports.UpdateResponsibilityPointsPayload = exports.UpdateResponsibilityPointsInput = void 0;
const schema_1 = require("@nexus/schema");
const __1 = require("..");
const general_1 = require("../../general");
const mongodb_1 = require("mongodb");
exports.UpdateResponsibilityPointsInput = schema_1.inputObjectType({
    name: 'UpdateResponsibilityPointsInput',
    definition(t) {
        t.id('studentId', { required: true });
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum });
        t.float('points', { required: true });
    },
});
exports.UpdateResponsibilityPointsPayload = schema_1.objectType({
    name: 'UpdateResponsibilityPointsPayload',
    definition(t) {
        t.field('responsibilityPoints', { type: __1.ResponsibilityPoints });
    },
});
exports.UpdateResponsibilityPoints = schema_1.mutationField('updateResponsibilityPoints', {
    type: exports.UpdateResponsibilityPointsPayload,
    args: {
        input: schema_1.arg({ type: exports.UpdateResponsibilityPointsInput, required: true }),
    },
    resolve(_, { input: { studentId, points, markingPeriod } }, { studentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield studentData.updateOne({
                'student._id': new mongodb_1.ObjectId(studentId),
                responsibilityPoints: { $exists: true },
                markingPeriod,
            }, {
                $inc: { responsibilityPoints: points },
            });
            const responsibilityPoints = yield studentData.findOne({
                'student._id': new mongodb_1.ObjectId(studentId),
                responsibilityPoints: { $exists: true },
                markingPeriod,
            });
            return { responsibilityPoints };
        });
    },
});
//# sourceMappingURL=updateResponsibilityPoints.js.map