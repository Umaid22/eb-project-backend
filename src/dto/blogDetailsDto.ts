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
	tag: object;
	createdAt: Date;
	author: authorType;
}

export class BlogDetailsDTO {
	_id: object;
	title: string;
	content: string;
	photo: string;
	tag: object;
	createdAt: Date;
	authorID: object;
	authorName: string;
	authorEmail: string;

	constructor(blog: blogType) {
		this._id = blog._id;
		this.title = blog.title;
		this.content = blog.content;
		this.photo = blog.photoPath;
		this.tag = blog.tag;
		this.createdAt = blog.createdAt;
		this.authorID = blog.author._id;
		this.authorName = blog.author.username;
		this.authorEmail = blog.author.email;
	}
}
