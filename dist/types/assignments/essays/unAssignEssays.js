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
exports.UnAssignEssays = exports.UnAssignEssaysPayload = exports.UnAssignEssaysInput = void 0;
const schema_1 = require("@nexus/schema");
const _1 = require(".");
const mongodb_1 = require("mongodb");
exports.UnAssignEssaysInput = schema_1.inputObjectType({
    name: 'UnAssignEssaysInput',
    definition(t) {
        t.list.id('studentIds', { required: true });
        t.string('section', { required: true });
    },
});
exports.UnAssignEssaysPayload = schema_1.objectType({
    name: 'UnAssignEssaysPayload',
    definition(t) {
        t.list.field('essays', { type: _1.Essay });
    },
});
exports.UnAssignEssays = schema_1.mutationField('unAssignEssays', {
    type: exports.UnAssignEssaysPayload,
    args: { input: schema_1.arg({ type: exports.UnAssignEssaysInput, required: true }) },
    resolve(_, { input: { studentIds, section } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const essays = [];
            for (const _id of studentIds) {
                const essayValidation = yield assignmentData.findOne({
                    'hasOwner._id': new mongodb_1.ObjectId(_id),
                    'readings.readingSections': section,
                });
                if (essayValidation) {
                    yield assignmentData.updateOne({
                        'hasOwner._id': new mongodb_1.ObjectId(_id),
                        'readings.readingSections': section,
                    }, {
                        $set: {
                            assigned: false,
                        },
                    });
                }
                const essay = yield assignmentData.findOne({
                    'hasOwner._id': new mongodb_1.ObjectId(_id),
                    'readings.readingSections': section,
                });
                essays.push(essay);
            }
            return { essays };
        });
    },
});
//# sourceMappingURL=unAssignEssays.js.map