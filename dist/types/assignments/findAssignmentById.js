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
exports.FindAssignmentById = exports.FindAssignmentByIdPayload = exports.FindAssignmentByIdInput = void 0;
const schema_1 = require("@nexus/schema");
const assignments_1 = require("./assignments");
const mongodb_1 = require("mongodb");
exports.FindAssignmentByIdInput = schema_1.inputObjectType({
    name: 'FindAssignmentByIdInput',
    definition(t) {
        t.id('assignmentId', { required: true });
    },
});
exports.FindAssignmentByIdPayload = schema_1.objectType({
    name: 'FindAssignmentByIdPayload',
    definition(t) {
        t.field('assignment', { type: assignments_1.Assignment });
    },
});
exports.FindAssignmentById = schema_1.queryField('findAssignmentById', {
    type: exports.FindAssignmentByIdPayload,
    args: { input: schema_1.arg({ type: exports.FindAssignmentByIdInput, required: true }) },
    resolve(_, { input: { assignmentId } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignment = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectId(assignmentId),
            });
            return { assignment };
        });
    },
});
//# sourceMappingURL=findAssignmentById.js.map