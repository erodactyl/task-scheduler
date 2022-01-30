"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnprocessableEntity = exports.NotFound = void 0;
class CustomError extends Error {
}
class NotFound extends CustomError {
    constructor(message) {
        super(message);
        this.msg = message;
        this.name = "NotFound";
        this.status = 404;
    }
}
exports.NotFound = NotFound;
class UnprocessableEntity extends CustomError {
    constructor(message, errors) {
        super(message);
        this.msg = message;
        this.name = "UnprocessableEntity";
        this.status = 422;
        this.errors = errors;
    }
}
exports.UnprocessableEntity = UnprocessableEntity;
//# sourceMappingURL=errors.js.map