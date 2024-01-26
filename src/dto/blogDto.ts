interface AuthorType {
	_id?: object;
	username?: string;
	email?: string;
}
interface blogType {
	_id: object;
	title: string;
	content: string;
	author?: AuthorType;
	photoPath: string;
	tags: string;
	createdAt: Date;
	category: string;
	featured: string;
}
class BlogDTO {
	_id: object;
	title: string;
	content: string;
	authorID?: object;
	authorName?: string;
	authorEmail?: string;
	photo: string;
	tags: string;
	createdAt: Date;
	category: string;
	featured: string;

	constructor(blog: blogType) {
		this._id = blog._id;
		this.title = blog.title;
		this.content = blog.content;
		this.authorID = blog.author?._id;
		this.authorEmail = blog.author?.email;
		this.authorName = blog.author?.username;
		this.photo = blog.photoPath;
		this.tags = blog.tags;
		this.createdAt = blog.createdAt;
		this.category = blog.category;
		this.featured = blog.featured;
	}
}

export { BlogDTO };
