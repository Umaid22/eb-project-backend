interface blogType {
	_id: object;
	title: string;
	content: string;
	author: object;
	photoPath: string;
	tag: object;
	createdAt: Date;
}
class BlogDTO {
	_id: object;
	title: string;
	content: string;
	author: object;
	photo: string;
	tag: object;
	createdAt: Date;

	constructor(blog: blogType) {
		this._id = blog._id;
		this.title = blog.title;
		this.content = blog.content;
		this.author = blog.author;
		this.photo = blog.photoPath;
		this.tag = blog.tag;
		this.createdAt = blog.createdAt;
	}
}

export { BlogDTO };
