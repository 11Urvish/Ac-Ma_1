import { Request, Response } from "express";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { IResponseType } from "../../core/IResponseType.interface";
import { ResponseBuilder } from "../../core/response-builder";
import { ReportService } from "./report.service";

export class ReportController {
  constructor(private ds: ReportService) { }

  /**
   * @name findTransactionReport
   * @method POST
   * @memberof UserController
   * @description Find Transaction Report
   */
  findTransactionReport = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      const result: IResponseType = await this.ds.findTransactionReport(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  }

  /**
   * @name findInterestReport
   * @method POST
   * @memberof UserController
   * @description Find Interest Report
   */
  findInterestReport = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      const result: IResponseType = await this.ds.findInterestReport(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  }

}