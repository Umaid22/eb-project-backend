interface authorType {
	_id: object;
	username: string;
	email: string;
}

interface BlogreferenceType {
	author: object;
}

interface commentType {
	_id: object;
	content: string;
	blogreference?: BlogreferenceType;
	createdAt: Date;
	author: authorType;
}

export class CommentDTO {
	id: object;
	content: string;
	// blogreference?: object;
	blogAuthor: object;
	createdAt: Date;
	authorID: object;
	authorName: string;
	authorEmail: string;

	constructor(comment: commentType) {
		this.id = comment._id;
		this.content = comment.content;
		// this.blogreference = comment.blogreference;
		this.blogAuthor = comment.blogreference?.author!;
		this.createdAt = comment.createdAt;
		this.authorID = comment.author._id;
		this.authorName = comment.author.username;
		this.authorEmail = comment.author.email;
	}
}
