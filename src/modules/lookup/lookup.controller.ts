import { Request, Response } from "express";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { IResponseType } from "../../core/IResponseType.interface";
import { ResponseBuilder } from "../../core/response-builder";
import { MESSAGE } from "../../shared/constants/app.const";
import { APP_ENUM } from "../../shared/enums/app.enum";
import { LookupService } from "./lookup.service";

export class LookupController {
  constructor(private ds: LookupService) { }

  /**
   * @name Find
   * @method POST
   * @memberof LookupController
   */
  find = async (req: Request, res: Response) => {
    try {
      let result: IResponseType;
      const lookups: any = req.body;
      console.log(req.body);
      console.log(lookups);
      const collectionData = {};
      for (let i = 0; i < lookups.length; i++) {
        if (lookups[i].lookup === APP_ENUM.LOOKUP.CUSTOMER) {
          collectionData[APP_ENUM.LOOKUP.CUSTOMER] = await this.ds.findCustomers();
        }
        if (lookups[i].lookup === APP_ENUM.LOOKUP.COUNTRY) {
          collectionData[APP_ENUM.LOOKUP.COUNTRY] = await this.ds.findCountryLookup();
        }
        if (lookups[i].lookup === APP_ENUM.LOOKUP.LOAN_STATUS) {
          collectionData[APP_ENUM.LOOKUP.LOAN_STATUS] = await this.ds.findLoanStatus();
        }
        if (lookups[i].lookup === APP_ENUM.LOOKUP.MASTER_CHART) {
          collectionData[APP_ENUM.LOOKUP.MASTER_CHART] = await this.ds.findMasterChartData();
        }
        if (lookups[i].lookup === APP_ENUM.LOOKUP.PERMISSION) {
          collectionData[APP_ENUM.LOOKUP.PERMISSION] = await this.ds.findPermissions();
        }
        // if (lookups[i].lookup === APP_ENUM.LOOKUP.PRODUCT) {
        //   collectionData[APP_ENUM.LOOKUP.PRODUCT] = await this.ds.findProduct();
        // }
        if (lookups[i].lookup === APP_ENUM.LOOKUP.ROLE) {
          collectionData[APP_ENUM.LOOKUP.ROLE] = await this.ds.findRoles();
        }
        if (lookups[i].lookup === APP_ENUM.LOOKUP.STATE) {
          collectionData[APP_ENUM.LOOKUP.STATE] = await this.ds.findStates();
        }
        if (lookups[i].lookup === APP_ENUM.LOOKUP.FIRM) {
          collectionData[APP_ENUM.LOOKUP.FIRM] = await this.ds.findFirms();
        }
      }
      // eslint-disable-next-line prefer-const
      result = {
        status: APP_ENUM.HTTP_STATUS.OK,
        data: collectionData,
        message: MESSAGE.GET
      };
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      ResponseBuilder.InternalServerError(res, error);
    }
  }

  /**
   * @name findStatesByCountryId
   * @method POST
   * @memberof CustomerController
   * @description Fetch Customer by unique id
   */
  findStatesByCountryId = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      console.log('params', params);
      const result: IResponseType = await this.ds.findStatesByCountryId(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  }

}