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
exports.UpdateArticleReview = exports.UpdateArticleReviewPayload = exports.UpdateArticleReviewInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.UpdateArticleReviewInput = schema_1.inputObjectType({
    name: 'UpdateArticleReviewInput',
    definition(t) {
        t.id('articleReviewId', { required: true });
        t.string('articleTitle', { required: true });
        t.string('articleAuthor', { required: true });
        t.string('publishedDate');
        t.string('articleLink', { required: true });
        t.string('issue', { required: true });
        t.boolean('bias');
        t.string('solutions');
        t.string('topicsImportance', { required: true });
    },
});
exports.UpdateArticleReviewPayload = schema_1.objectType({
    name: 'UpdateArticleReviewPayload',
    definition(t) {
        t.field('articleReview', { type: _1.ArticleReview });
    },
});
exports.UpdateArticleReview = schema_1.mutationField('updateArticleReview', {
    type: exports.UpdateArticleReviewPayload,
    args: { input: schema_1.arg({ type: exports.UpdateArticleReviewInput, required: true }) },
    resolve(_, { input: { articleReviewId, articleTitle, articleAuthor, publishedDate, articleLink, issue, bias, solutions, topicsImportance, }, }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const articleReviewCheck = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectId(articleReviewId),
            });
            if (articleReviewCheck) {
                assignmentData.updateOne({ _id: new mongodb_1.ObjectId(articleReviewId) }, {
                    $set: {
                        articleTitle,
                        articleAuthor,
                        publishedDate,
                        articleLink,
                        issue,
                        bias,
                        solutions,
                        topicsImportance,
                    },
                });
                const articleReview = yield assignmentData.findOne({
                    _id: new mongodb_1.ObjectId(articleReviewId),
                });
                return { articleReview };
            }
            else
                throw new Error('ArticleReview does not exist.');
        });
    },
});
//# sourceMappingURL=updateArticleReview.js.map