import { Request, Response } from "express";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { IResponseType } from "../../core/IResponseType.interface";
import { ResponseBuilder } from "../../core/response-builder";
import { FirmService } from "./firm.service";

export class FirmController {
  constructor(private ds: FirmService) { }

  /**
   * @name findAll
   * @method POST
   * @memberof CustomerController
   * @description Get all Customers
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
   * @method POST
   * @memberof CustomerController
   * @description Fetch Customer by unique id
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
   * @name findByValue
   * @method POST
   * @memberof CustomerController
   * @description Fetch Customer by unique id
   */
  findByValue = async (req: Request, res: Response) => {
    try {
      const params = { ...req.query, ...req.user };
      console.log('params', params);
      const result: IResponseType = await this.ds.findByValue(params);
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
   * @memberof CustomerController
   * @description This method is used to create company
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
   * @memberof CustomerController
   * @description This method is used to update Customer
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
   * @memberof CustomerController
   * @description This method is used to delete Customer
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