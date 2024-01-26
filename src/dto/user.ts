interface userType {
	_id: object;
	username: string;
	email: string;
}

class UserDTO {
	_id: object;
	username: string;
	email: string;
	constructor(user: userType) {
		this._id = user._id;
		this.username = user.username;
		this.email = user.email;
	}
}

export { UserDTO };
