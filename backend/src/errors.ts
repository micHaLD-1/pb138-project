export class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UnprocessableError extends Error {
  constructor(message = "Unprocessable entity") {
    super(message);
    this.name = "UnprocessableError";
  }
}

export class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized: Missing or invalid token") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden: You do not have permission to perform this action") {
    super(message);
    this.name = "ForbiddenError";
  }
}
