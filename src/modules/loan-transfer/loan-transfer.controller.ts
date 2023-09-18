import { Request, Response } from "express";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { IResponseType } from "../../core/IResponseType.interface";
import { ResponseBuilder } from "../../core/response-builder";
import { LoanTransferService } from "./loan-transfer.service";

export class LoanTransferController {

  constructor(private ds: LoanTransferService) { }

  /**
   * @name findAll
   * @method POST
   * @memberof LoanTransferController
   * @description Get all transferloans
   */
  findAll = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      const result: IResponseType = await this.ds.findAll(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  }

  /**
   * @name findById
   * @method GET
   * @memberof LoanTransferController
   * @description Fetch Loan Transfer by unique id
   */
  findById = async (req: Request, res: Response) => {
    try {
      const params = { ...req.query, ...req.user };
      console.log('params', params);
      const result: IResponseType = await this.ds.findById(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  }

  /**
   * @name findBundleId
   * @method POST
   * @memberof LoanController
   * @description Fetch Loan by unique id
   */
  findBundleId = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      const result: IResponseType = await this.ds.findBundleId(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  }

  /**
   * @name create
   * @method POST
   * @memberof LoanTransferController
   * @description Create new loan transfer
   */
  create = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      console.log(params);
      const result: IResponseType = await this.ds.create(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  }

  /**
  * @name update
  * @method POST
  * @memberof LoanTransferController
  * @description This method is used to update user
  */
  update = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      const result: IResponseType = await this.ds.update(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  }

  /**
   * @name delete
   * @method POST
   * @memberof LoanTransferController
   * @description This method is used to delete user
   */
  delete = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      const result: IResponseType = await this.ds.delete(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  }
}