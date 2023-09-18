import { Response } from 'express';
import { APP_ENUM } from '../shared/enums/app.enum';
import { IResponseType } from './IResponseType.interface';

export class ResponseBuilder {

  /**
   * @name OK
   */
  static Ok<T>(res: Response, result: IResponseType) {
    result.status = APP_ENUM.HTTP_STATUS.OK;
    res.json(result);
  }

  static InternalServerError(res: Response, error: Error) {
    const status = APP_ENUM.HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const result = { status, message: error.message };
    res.json(result);
  }


  static UnauthorizedAccessError(res: Response, error: Error) {
    let status = APP_ENUM.HTTP_STATUS.UNAUTHORIZED;
    switch (error.name) {
      case APP_ENUM.TYPE.ERROR.NOT_FOUND:
        status = APP_ENUM.HTTP_STATUS.NOT_FOUND;
        break;

      case APP_ENUM.TYPE.ERROR.CONFLICT:
        status = APP_ENUM.HTTP_STATUS.CONFLICT;
        break;

      default:
        status = APP_ENUM.HTTP_STATUS.UNAUTHORIZED;
        break;
    }

    const result = { status, message: error.message };
    res.json(result);
  }

}