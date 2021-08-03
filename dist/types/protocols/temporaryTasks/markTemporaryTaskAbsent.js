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
exports.MarkTemporaryTaskAbsent = exports.MarkTemporaryTaskAbsentPayload = exports.MarkTemporaryTaskAbsentInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.MarkTemporaryTaskAbsentInput = schema_1.inputObjectType({
    name: 'MarkTemporaryTaskAbsentInput',
    definition(t) {
        t.id('taskId', { required: true });
        t.boolean('studentPresent');
    },
});
exports.MarkTemporaryTaskAbsentPayload = schema_1.objectType({
    name: 'MarkTemporaryTaskAbsentPayload',
    definition(t) {
        t.field('temporaryTask', { type: _1.TemporaryTask });
    },
});
exports.MarkTemporaryTaskAbsent = schema_1.mutationField('markTemporaryTaskAbsent', {
    type: exports.MarkTemporaryTaskAbsentPayload,
    args: {
        input: schema_1.arg({ type: exports.MarkTemporaryTaskAbsentInput, required: true }),
    },
    resolve(_, { input: { taskId, studentPresent } }, { temporaryTaskData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield temporaryTaskData.findOne({
                _id: new mongodb_1.ObjectId(taskId),
            });
            if (check) {
                yield temporaryTaskData.updateOne({ _id: new mongodb_1.ObjectId(taskId) }, { $set: { studentPresent } });
            }
            const temporaryTask = yield temporaryTaskData.findOne({
                _id: new mongodb_1.ObjectId(taskId),
            });
            return { temporaryTask };
        });
    },
});
//# sourceMappingURL=markTemporaryTaskAbsent.js.map