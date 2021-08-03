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
exports.DeleteAllSchoolDays = exports.DeleteAllSchoolDaysPayload = void 0;
const schema_1 = require("@nexus/schema");
exports.DeleteAllSchoolDaysPayload = schema_1.objectType({
    name: 'DeleteAllSchoolDaysPayload',
    definition(t) {
        t.boolean('removed');
    },
});
exports.DeleteAllSchoolDays = schema_1.mutationField('deleteAllSchoolDays', {
    type: exports.DeleteAllSchoolDaysPayload,
    resolve(_, __, { schoolDayData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deletedCount } = yield schoolDayData.deleteMany();
            console.log(deletedCount);
            return { removed: true };
        });
    },
});
//# sourceMappingURL=deleteAllSchoolDays.js.map