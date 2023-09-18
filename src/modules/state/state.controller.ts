import { Request, Response } from 'express';
import { UnauthorizedAccessErrorResult } from '../../core/error-result';
import { IResponseType } from '../../core/IResponseType.interface';
import { ResponseBuilder } from '../../core/response-builder';
import { StateService } from './state.service';

export class StateController {
    constructor(private ds: StateService) { }


    /**
     * @name create
     * @method POST
     * @memberof StateController
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



}
