export abstract class ErrorResult extends Error {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}

export class InternalServerErrorResult extends ErrorResult { }
export class UnauthorizedAccessErrorResult extends ErrorResult { }
export class UserBalanceErrorResult extends ErrorResult { }