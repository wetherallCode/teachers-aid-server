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
exports.FindAssignmentByStudentId = exports.FindAssignmentByStudentIdPayload = exports.FindAssignmentByStudentIdInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
const article_reviews_1 = require("./article-reviews");
exports.FindAssignmentByStudentIdInput = schema_1.inputObjectType({
    name: 'FindAssignmentByStudentIdInput',
    definition(t) {
        t.id('studentId', { required: true });
    },
});
exports.FindAssignmentByStudentIdPayload = schema_1.objectType({
    name: 'FindAssignmentByStudentIdPayload',
    definition(t) {
        t.list.field('assignments', { type: _1.Assignment });
        t.list.field('articleReviews', { type: article_reviews_1.ArticleReview });
    },
});
exports.FindAssignmentByStudentId = schema_1.queryField('findAssignmentByStudentId', {
    type: exports.FindAssignmentByStudentIdPayload,
    args: {
        input: schema_1.arg({ type: exports.FindAssignmentByStudentIdInput, required: true }),
    },
    resolve(_, { input: { studentId } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignments = yield assignmentData
                .find({
                'hasOwner._id': new mongodb_1.ObjectId(studentId),
                articleTitle: { $exists: false },
            })
                .toArray();
            const articleReviews = yield assignmentData
                .find({
                'hasOwner._id': new mongodb_1.ObjectId(studentId),
                articleTitle: { $exists: true },
            })
                .toArray();
            return { assignments, articleReviews };
        });
    },
});
//# sourceMappingURL=findAssignmentByStudentId.js.map