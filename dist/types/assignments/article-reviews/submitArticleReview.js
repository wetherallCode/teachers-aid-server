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
exports.SubmitArticleReview = exports.SubmitArticleReviewPayload = exports.SubmitArticleReviewInput = void 0;
const schema_1 = require("@nexus/schema");
const mongodb_1 = require("mongodb");
const _1 = require(".");
const general_1 = require("../../general");
exports.SubmitArticleReviewInput = schema_1.inputObjectType({
    name: 'SubmitArticleReviewInput',
    definition(t) {
        t.id('articleReviewId', { required: true });
        t.field('markingPeriod', { type: general_1.MarkingPeriodEnum, required: true });
    },
});
exports.SubmitArticleReviewPayload = schema_1.objectType({
    name: 'SubmitArticleReviewPayload',
    definition(t) {
        t.field('articleReview', { type: _1.ArticleReview });
    },
});
exports.SubmitArticleReview = schema_1.mutationField('submitArticleReview', {
    type: exports.SubmitArticleReviewPayload,
    args: { input: schema_1.arg({ type: exports.SubmitArticleReviewInput, required: true }) },
    resolve(_, { input: { articleReviewId, markingPeriod } }, { assignmentData, studentData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const articleReviewCheck = yield assignmentData.findOne({
                _id: new mongodb_1.ObjectId(articleReviewId),
            });
            function handleLateness() {
                const submittedDateTime = new Date().toLocaleString();
                const dueDateTime = `${articleReviewCheck.dueDate}, ${articleReviewCheck.dueTime}`;
                if (Date.parse(submittedDateTime) > Date.parse(dueDateTime)) {
                    return true;
                }
                else
                    return false;
            }
            const articleReviewComplete = articleReviewCheck.articleTitle !== '' &&
                articleReviewCheck.articleAuthor !== '' &&
                articleReviewCheck.articleLink !== '' &&
                articleReviewCheck.issue !== '' &&
                articleReviewCheck.topicsImportance !== '';
            if (articleReviewCheck) {
                yield assignmentData.updateOne({ _id: new mongodb_1.ObjectId(articleReviewId) }, {
                    $set: {
                        submitted: true,
                        assigned: false,
                        completed: true,
                        late: handleLateness(),
                        'score.earnedPoints': articleReviewComplete ? 10 : 6,
                    },
                });
                yield studentData.updateOne({
                    'student._id': new mongodb_1.ObjectId(articleReviewCheck.hasOwner._id),
                    markingPeriod,
                    responsibilityPoints: { $exists: true },
                }, {
                    $inc: { responsibilityPoints: handleLateness() ? 4 : 3 },
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
//# sourceMappingURL=submitArticleReview.js.map