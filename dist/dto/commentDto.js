"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentDTO = void 0;
class CommentDTO {
    constructor(comment) {
        var _a;
        this.id = comment._id;
        this.content = comment.content;
        // this.blogreference = comment.blogreference;
        this.blogAuthor = (_a = comment.blogreference) === null || _a === void 0 ? void 0 : _a.author;
        this.createdAt = comment.createdAt;
        this.authorID = comment.author._id;
        this.authorName = comment.author.username;
        this.authorEmail = comment.author.email;
    }
}
exports.CommentDTO = CommentDTO;
