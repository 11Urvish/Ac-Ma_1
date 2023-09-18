import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { IResponseType } from "../../core/IResponseType.interface";
import UserModel from "../../models/user.model";
import { MESSAGE } from "../../shared/constants/app.const";
import { APP_ENUM } from "../../shared/enums/app.enum";
import { NxService } from "../../shared/nx-library/nx-service";

export class AuthService {

  constructor(private nx: NxService) { }

  /**
   * @name login
   */
  login = async (params: any): Promise<IResponseType> => {
    try {
      const USER_STATUS = APP_ENUM.STATUS.USER;
      let response: IResponseType;
      const { username, password } = params;

      // find user by email or mobile
      const findUser = await UserModel.findOne({
        $or: [{ email: username }, { mobile: username }]
      }).select('company_id role_id first_name last_name email financial_year  mobile user_type status password');

      if (!findUser) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.ERROR_CODE.NOT_FOUND, MESSAGE.INVALID_CREDENTIAL);
      } else if (findUser && findUser.status !== USER_STATUS.ACTIVE) {
        if (findUser.status === USER_STATUS.BLOCKED || findUser.user_type !== APP_ENUM.TYPE.USER.USER) {
          throw new UnauthorizedAccessErrorResult(APP_ENUM.ERROR_CODE.NOT_FOUND, MESSAGE.ACCOUNT_BLOCKED);
        } else {
          throw new UnauthorizedAccessErrorResult(APP_ENUM.ERROR_CODE.NOT_FOUND, MESSAGE.ACCOUNT_IN_ACTIVE);
        }
      }
      const isPasswordVerified = await this.nx.crypto.verifyPassword(findUser.password, password);
      if (!isPasswordVerified) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.ERROR_CODE.NOT_FOUND, MESSAGE.INVALID_CREDENTIAL);
      }

      const token = await this.nx.crypto.getToken(findUser);

      const userDetails = {
        id: findUser._id,
        company_id: findUser.company_id,
        first_name: findUser.first_name,
        last_name: findUser.last_name,
        email: findUser.email,
        mobile: findUser.mobile,
        user_type: findUser.user_type,
        status: findUser.status,
        role_id: findUser.role_id,
        financial_year: findUser.financial_year
      };
      response = { data: { user: userDetails, token }, message: MESSAGE.LOGIN };
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

}