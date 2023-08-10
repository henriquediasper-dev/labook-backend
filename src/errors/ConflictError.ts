import { BaseError } from "./BaseError";

export class ConflictError extends BaseError {
  constructor(message: string = "Identificador já declarado") {
    super(409, message);
  }
}
