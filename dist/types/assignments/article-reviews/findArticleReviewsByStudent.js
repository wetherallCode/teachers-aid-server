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
exports.FindArticleReviewsByStudent = exports.FindArticleReviewsByStudentPayload = exports.FindArticleReviewsByStudentInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
const general_1 = require("../../general");
exports.FindArticleReviewsByStudentInput = schema_1.inputObjectType({
    name: 'FindArticleReviewsByStudentInput',
    definition(t) {
        t.id('studentId', { required: true });
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum, required: true });
    },
});
exports.FindArticleReviewsByStudentPayload = schema_1.objectType({
    name: 'FindArticleReviewsByStudentPayload',
    definition(t) {
        t.list.field('articleReviews', { type: _1.ArticleReview });
    },
});
exports.FindArticleReviewsByStudent = schema_1.queryField('findArticleReviewsByStudent', {
    type: exports.FindArticleReviewsByStudentPayload,
    args: {
        input: schema_1.arg({ type: exports.FindArticleReviewsByStudentInput, required: true }),
    },
    resolve(_, { input: { studentId, markingPeriod } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const articleReviews = yield assignmentData
                .find({
                'hasOwner._id': new mongodb_1.ObjectId(studentId),
                articleTitle: { $exists: true },
                markingPeriod,
            })
                .toArray();
            return { articleReviews };
        });
    },
});
//# sourceMappingURL=findArticleReviewsByStudent.js.map