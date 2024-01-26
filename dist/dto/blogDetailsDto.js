"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogDetailsDTO = void 0;
class BlogDetailsDTO {
    constructor(blog) {
        this._id = blog._id;
        this.title = blog.title;
        this.content = blog.content;
        this.photoPath = blog.photoPath;
        this.tags = blog.tags;
        this.category = blog.category;
        this.featured = blog.featured;
        this.createdAt = blog.createdAt;
        this.authorID = blog.author._id;
        this.authorName = blog.author.username;
        this.authorEmail = blog.author.email;
    }
}
exports.BlogDetailsDTO = BlogDetailsDTO;
