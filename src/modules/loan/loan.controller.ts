import { Request, Response } from 'express';
import { UnauthorizedAccessErrorResult } from '../../core/error-result';
import { IResponseType } from '../../core/IResponseType.interface';
import { ResponseBuilder } from '../../core/response-builder';
import { LoanService } from './loan.service';

export class LoanController {
  constructor(private ds: LoanService) { }

  /**
   * @name findAll
   * @method POST
   * @memberof LoanController
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
  };

  /**
   * @name findById
   * @method POST
   * @memberof LoanController
   * @description Fetch Customer by unique id
   */
  findById = async (req: Request, res: Response) => {
    try {
      //const params = req.query;
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
  };

  /**
  * @name findUniqueLoanNumber
  * @method GET
  * @memberof LoanController
  * @description Fetch Customer by unique id
  */
  findUniqueLoanNumber = async (req: Request, res: Response) => {
    try {
      //const params = req.query;
      const params = { ...req.query, ...req.user };
      console.log('params', params);
      const result: IResponseType = await this.ds.findUniqueLoanNumber(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };

  /**
   * @name create
   * @method POST
   * @memberof LoanController
   * @description This method is used to create company
   */
  create = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      console.log(params);
      console.log('Ok');
      const result: IResponseType = await this.ds.create(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };

  /**
   * @name update
   * @method POST
   * @memberof LoanController
   * @description This method is used to update Customer
   */
  update = async (req: Request, res: Response) => {
    try {
      const params = req.body;
      const result: IResponseType = await this.ds.update(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };

  /**
   * @name delete
   * @method POST
   * @memberof LoanController
   * @description This method is used to delete Customer
   */
  delete = async (req: Request, res: Response) => {
    try {
      const params = req.body;
      const result: IResponseType = await this.ds.delete(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };

  /**
   * @name exportLoan
   * @method POST
   * @memberof LoanController
   * @description This method is used to export loan
   */
  exportLoan = async (req: Request, res: Response) => {
    try {
      const params = req.body;
      const result: IResponseType = await this.ds.exportLoan(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };



  /**
  * @name exportForm
  * @method POST
  * @memberof LoanController
  * @description This method is used to export loan
  */
  exportForm = async (req: Request, res: Response) => {
    try {
      const params = req.body;
      const result: IResponseType = await this.ds.exportForm(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };
}
