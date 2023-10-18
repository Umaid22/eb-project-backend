interface authorType {
	_id: object;
	username: string;
	email: string;
}

interface commentType {
	_id: object;
	content: string;
	blogreference?: object;
	createdAt: Date;
	author: authorType;
}

export class CommentDTO {
	id: object;
	content: string;
	blogreference?: object;
	createdAt: Date;
	authorID: object;
	authorName: string;
	authorEmail: string;

	constructor(comment: commentType) {
		this.id = comment._id;
		this.content = comment.content;
		this.blogreference = comment.blogreference;
		this.createdAt = comment.createdAt;
		this.authorID = comment.author._id;
		this.authorName = comment.author.username;
		this.authorEmail = comment.author.email;
	}
}
