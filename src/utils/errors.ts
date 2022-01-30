class CustomError extends Error {
  msg: string;
  name: string;
  status: number;
  errors: Error[];
}

class NotFound extends CustomError {
  constructor(message) {
    super(message);
    this.msg = message;
    this.name = "NotFound";
    this.status = 404;
  }
}

class UnprocessableEntity extends CustomError {
  constructor(message, errors) {
    super(message);
    this.msg = message;
    this.name = "UnprocessableEntity";
    this.status = 422;
    this.errors = errors;
  }
}

export { NotFound, UnprocessableEntity };
