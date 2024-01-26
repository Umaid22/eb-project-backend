type authorType = {
	_id: object;
	username: string;
	email: string;
};

interface blogType {
	_id: object;
	title: string;
	content: string;
	photoPath: string;
	tags: string;
	category: string;
	featured: string;
	createdAt: Date;
	author: authorType;
}

export class BlogDetailsDTO {
	_id: object;
	title: string;
	content: string;
	photoPath: string;
	tags: string;
	category: string;
	featured: string;
	createdAt: Date;
	authorID: object;
	authorName: string;
	authorEmail: string;

	constructor(blog: blogType) {
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
