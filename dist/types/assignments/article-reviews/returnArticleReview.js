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
exports.ReturnArticleReview = exports.ReturnArticleReviewPayload = exports.ReturnArticleReviewInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.ReturnArticleReviewInput = schema_1.inputObjectType({
    name: 'ReturnArticleReviewInput',
    definition(t) {
        t.id('articleReviewId', { required: true });
    },
});
exports.ReturnArticleReviewPayload = schema_1.objectType({
    name: 'ReturnArticleReviewPayload',
    definition(t) {
        t.field('articleReview', { type: _1.ArticleReview });
    },
});
exports.ReturnArticleReview = schema_1.mutationField('returnArticleReview', {
    type: exports.ReturnArticleReviewPayload,
    args: { input: schema_1.arg({ type: exports.ReturnArticleReviewInput, required: true }) },
    resolve(_, { input: { articleReviewId } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const articleReviewCheck = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectId(articleReviewId),
            });
            if (articleReviewCheck) {
                yield assignmentData.updateOne({
                    _id: new mongodb_1.ObjectId(articleReviewId),
                }, {
                    $set: { returned: true },
                });
                const articleReview = yield assignmentData.findOne({
                    _id: new mongodb_1.ObjectId(articleReviewId),
                });
                return { articleReview };
            }
            else
                throw new Error('ArticleReview does not exist');
        });
    },
});
//# sourceMappingURL=returnArticleReview.js.map