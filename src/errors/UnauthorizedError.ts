import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
  constructor(message: string = "Token inválido") {
    super(404, message);
  }
}
