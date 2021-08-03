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
exports.FindArticleReviewById = exports.FindArticleReviewByIdPayload = exports.FindArticleReviewByIdInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
exports.FindArticleReviewByIdInput = schema_1.inputObjectType({
    name: 'FindArticleReviewByIdInput',
    definition(t) {
        t.id('articleReviewId', { required: true });
    },
});
exports.FindArticleReviewByIdPayload = schema_1.objectType({
    name: 'FindArticleReviewByIdPayload',
    definition(t) {
        t.field('articleReview', { type: _1.ArticleReview });
    },
});
exports.FindArticleReviewById = schema_1.queryField('findArticleReviewById', {
    type: exports.FindArticleReviewByIdPayload,
    args: { input: schema_1.arg({ type: exports.FindArticleReviewByIdInput, required: true }) },
    resolve(_, { input: { articleReviewId } }, { assignmentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const articleReviewCheck = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectId(articleReviewId),
            });
            if (articleReviewCheck) {
                return { articleReview: articleReviewCheck };
            }
            else
                throw new Error('ArticleReview does not exist');
        });
    },
});
//# sourceMappingURL=findArticleReviewById.js.map