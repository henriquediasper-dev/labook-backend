import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
  constructor(
    message: string = "Acesso negado Você não tem permissão para acessar"
  ) {
    super(404, message);
  }
}
