import { Request, Response } from 'express';
import { UnauthorizedAccessErrorResult } from '../../core/error-result';
import { IResponseType } from '../../core/IResponseType.interface';
import { ResponseBuilder } from '../../core/response-builder';
import { DistrictService } from './district.service';

export class DistrictController {
    constructor(private ds: DistrictService) { }


    /**
     * @name create
     * @method POST
     * @memberof DistrictController
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
   * @name findByStateId
   * @method POST
   * @memberof CustomerController
   * @description Fetch Customer by unique id
   */
    findByStateId = async (req: Request, res: Response) => {
        try {
            const params = { ...req.body, ...req.user };
            console.log('params', params);
            const result: IResponseType = await this.ds.findByStateId(params);
            ResponseBuilder.Ok<IResponseType>(res, result);
        } catch (error) {
            if (error instanceof UnauthorizedAccessErrorResult) {
                return ResponseBuilder.UnauthorizedAccessError(res, error);
            }
            ResponseBuilder.InternalServerError(res, error);
        }
    }
}
