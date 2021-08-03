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
exports.DeleteAllTemporaryTasks = exports.DeleteAllTemporaryTasksPayload = void 0;
const schema_1 = require("@nexus/schema");
exports.DeleteAllTemporaryTasksPayload = schema_1.objectType({
    name: 'DeleteAllTemporaryTasksPayload',
    definition(t) {
        t.boolean('removed');
    },
});
exports.DeleteAllTemporaryTasks = schema_1.mutationField('deleteAllTemporaryTasks', {
    type: exports.DeleteAllTemporaryTasksPayload,
    resolve(_, __, { temporaryTaskData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deletedCount } = yield temporaryTaskData.deleteMany();
            console.log(deletedCount);
            return { removed: true };
        });
    },
});
//# sourceMappingURL=deleteAllTemporaryTasks.js.map