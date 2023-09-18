import { Request, Response } from 'express';
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { IResponseType } from "../../core/IResponseType.interface";
import { ResponseBuilder } from "../../core/response-builder";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private ds: AuthService) { }

  /**
   * @name login
   */
  login = async (req: Request, res: Response) => {
    try {
      console.log('login called');
      const params = req.body;
      const result: IResponseType = await this.ds.login(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  }
}