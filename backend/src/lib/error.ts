export class ApiError extends Error {
  public status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
