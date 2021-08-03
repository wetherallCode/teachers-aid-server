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
exports.DeleteReviews = exports.DeleteReviewsPayload = exports.DeleteReviewsInput = void 0;
const schema_1 = require("@nexus/schema");
exports.DeleteReviewsInput = schema_1.inputObjectType({
    name: 'DeleteReviewsInput',
    definition(t) {
        t.string('assignedDate', { required: true });
    },
});
exports.DeleteReviewsPayload = schema_1.objectType({
    name: 'DeleteReviewsPayload',
    definition(t) {
        t.boolean('removed');
    },
});
exports.DeleteReviews = schema_1.mutationField('deleteReviews', {
    type: exports.DeleteReviewsPayload,
    args: { input: schema_1.arg({ type: exports.DeleteReviewsInput, required: true }) },
    resolve(_, { input: { assignedDate } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deletedCount } = yield assignmentData.deleteMany({
                assignedDate: assignedDate,
                articleTitle: { $exists: true },
            });
            console.log(deletedCount);
            return { removed: true };
        });
    },
});
//# sourceMappingURL=deleteReviews.js.map