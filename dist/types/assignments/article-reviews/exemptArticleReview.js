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
exports.ExemptArticleReview = exports.ExemptArticleReviewPayload = exports.ExemptArticleReviewInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.ExemptArticleReviewInput = schema_1.inputObjectType({
    name: 'ExemptArticleReviewInput',
    definition(t) {
        t.id('articleReviewId', { required: true });
    },
});
exports.ExemptArticleReviewPayload = schema_1.objectType({
    name: 'ExemptArticleReviewPayload',
    definition(t) {
        t.field('articleReview', { type: _1.ArticleReview });
    },
});
exports.ExemptArticleReview = schema_1.mutationField('exemptArticleReview', {
    type: exports.ExemptArticleReviewPayload,
    args: { input: schema_1.arg({ type: exports.ExemptArticleReviewInput, required: true }) },
    resolve(_, { input: { articleReviewId } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const articleReviewCheck = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectId(articleReviewId),
            });
            if (articleReviewCheck) {
                const articleReview = yield assignmentData.findOne({
                    _id: new mongodb_1.ObjectId(articleReviewId),
                });
                yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(articleReviewId) }, {
                    $set: { exempt: true },
                });
                return { articleReview: articleReview };
            }
            else
                throw new Error('Article Review does not exist');
        });
    },
});
//# sourceMappingURL=exemptArticleReview.js.map