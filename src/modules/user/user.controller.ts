import { Request, Response } from "express";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { IResponseType } from "../../core/IResponseType.interface";
import { ResponseBuilder } from "../../core/response-builder";
import { UserService } from "./user.service";

export class UserController {
  constructor(private ds: UserService) { }

  /**
   * @name findAll
   * @method POST
   * @memberof UserController
   * @description Get all Users
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
   * @memberof UserController
   * @description Fetch user by unique id
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
   * @name findUserSettingsById
   * @method POST
   * @memberof UserController
   * @description Fetch user by unique id
   */
  findUserSettingsById = async (req: Request, res: Response) => {
    try {
      const params = { ...req.query, ...req.user };
      console.log('params', params);
      const result: IResponseType = await this.ds.findUserSettingsById(params);
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
   * @memberof UserController
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
   * @memberof UserController
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
   * @name updateFinancialYear
   * @method POST
   * @memberof UserController
   * @description This method is used to update user
   */
  updateFinancialYear = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      const result: IResponseType = await this.ds.updateFinancialYear(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  }

  /**
   * @name updateSetting
   * @method POST
   * @memberof UserController
   * @description This method is used to update user
   */
  updateSetting = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      const result: IResponseType = await this.ds.updateSetting(params);
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
   * @memberof UserController
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

  /**
   * @name updateProfile
   * @method POST
   * @memberof UserController
   * @description This method is used to delete user
   */
  updateProfile = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      const result: IResponseType = await this.ds.updateProfile(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  }

  /**
   * @name changePassword
   * @method POST
   * @memberof UserController
   * @description This method is used to delete user
   */
  changePassword = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      const result: IResponseType = await this.ds.changePassword(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  }
}