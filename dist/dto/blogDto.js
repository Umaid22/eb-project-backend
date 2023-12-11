"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogDTO = void 0;
class BlogDTO {
    constructor(blog) {
        var _a, _b, _c;
        this._id = blog._id;
        this.title = blog.title;
        this.content = blog.content;
        this.authorID = (_a = blog.author) === null || _a === void 0 ? void 0 : _a._id;
        this.authorEmail = (_b = blog.author) === null || _b === void 0 ? void 0 : _b.email;
        this.authorName = (_c = blog.author) === null || _c === void 0 ? void 0 : _c.username;
        this.photo = blog.photoPath;
        this.tags = blog.tags;
        this.createdAt = blog.createdAt;
        this.category = blog.category;
        this.featured = blog.featured;
    }
}
exports.BlogDTO = BlogDTO;
