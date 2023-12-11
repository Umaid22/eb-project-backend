"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = void 0;
class UserDTO {
    constructor(user) {
        this._id = user._id;
        this.username = user.username;
        this.email = user.email;
    }
}
exports.UserDTO = UserDTO;
