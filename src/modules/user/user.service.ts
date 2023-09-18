import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { IResponseType } from "../../core/IResponseType.interface";
import UserModel from "../../models/user.model";
import { MESSAGE } from "../../shared/constants/app.const";
import { APP_ENUM } from "../../shared/enums/app.enum";
import { NxService } from "../../shared/nx-library/nx-service";

export class UserService {
  constructor(private nx: NxService) { }

  /**
   * @name findAll
   * @param {Object} params 
   */
  findAll = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      console.log('params', params);
      const { page, limit, sort, sortBy, filter, uid, cid, user_type } = params;
      const pageInt = parseInt(page, 10);
      const limitInt = parseInt(limit, 10);
      const skip = (pageInt - 1) * limitInt;
      const sortQuery = {};

      if (sortBy) {
        sortQuery[sortBy] = sort === APP_ENUM.SORT.ASC ? 1 : -1;;
      } else {
        sortQuery["_id"] = -1;
      }

      const filterQuery: any[] = [
        {
          $match: {
            user_type: { $ne: APP_ENUM.TYPE.USER.SUPER_ADMIN },
            company_id: cid,
            $or: [
              { first_name: { $regex: '.*' + filter + '.*', $options: "i" } },
              { last_name: { $regex: '.*' + filter + '.*', $options: "i" } },
              { email: { $regex: '.*' + filter + '.*', $options: "i" } },
              { mobile: { $regex: '.*' + filter + '.*', $options: "i" } },
            ]
          }
        }, {

          $project: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            email: 1,
            mobile: 1,
            status: 1
          }
        },
        { $sort: sortQuery },
        { $skip: skip },
        { $limit: limitInt }
      ];

      const count = await UserModel.countDocuments(filterQuery[0].$match);
      const result = await UserModel.aggregate(filterQuery);
      response = {
        message: MESSAGE.GET,
        data: { result, count }
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name findById
   * @param {Object} params 
   */
  findById = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { uid, cid, id } = params;
      const user = await UserModel.findOne({ _id: id, company_id: cid, })
        .select('company_id role_id first_name last_name status email mobile');
      response = { data: user, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name findUserSettingsById
   * @param {Object} params 
   */
  findUserSettingsById = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { uid, cid, id } = params;
      const user = await UserModel.findOne({ _id: id })
        .select('settings');
      response = { data: user, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name create
   * @param {Object} params
   */
  create = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { uid, cid, role_id, first_name, last_name, status, email, mobile, password } = params;

      const findUser = await UserModel.findOne({ $or: [{ email }, { mobile }] });
      if (findUser) {
        throw new UnauthorizedAccessErrorResult(
          APP_ENUM.TYPE.ERROR.CONFLICT,
          MESSAGE.DUPLICATE_PHONE
        );
      }
      const passwordHash = await this.nx.crypto.hashPassword(password);
      const createModel = new UserModel({
        first_name, last_name, email, mobile,
        company_id: cid,
        user_type: APP_ENUM.TYPE.USER.USER,
        status: +status,
        password: passwordHash,
        role_id,
        created_by: uid,
      });
      const createdCompany = await createModel.save();
      response = { data: createdCompany, message: MESSAGE.CREATE };
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @name update
   * @param {Object} params
   */
  update = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { id, uid, cid, role_id, first_name, last_name, status, email, mobile } = params;

      const updateModel = {
        $set: {
          first_name, last_name, status, email, mobile, role_id,
          updated_by: uid,
          updated_at: new Date(),
        }
      };

      const updatedUser = await UserModel.findOneAndUpdate({ _id: id }, updateModel, { new: true });
      response = { data: updatedUser, message: MESSAGE.UPDATE };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
  * @name updateFinancialYear
  * @param {Object} params
  */
  updateFinancialYear = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { id, uid, financial_year } = params;
      console.log('hello')
      console.log(id, uid, financial_year)
      const updateModel = {
        $set: {
          financial_year,
          updated_by: uid,
          updated_at: new Date(),
        }
      };
      const updatedUser = await UserModel.findOneAndUpdate({ _id: uid }, updateModel, { new: true });
      response = { data: updatedUser, message: MESSAGE.UPDATE };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name updateSetting
   * @param {Object} params
   */
  updateSetting = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { id, uid, cid, payment_frequency, language } = params;
      const updateModel = {
        $set: {
          settings: { payment_frequency, language },
          updated_by: uid,
          updated_at: new Date(),
        }
      };
      const updateModelOption: { new: boolean } = { new: true };
      const updatedUser = await UserModel.findOneAndUpdate({ _id: id }, updateModel, updateModelOption);
      response = { data: updatedUser, message: MESSAGE.UPDATE };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name delete
   * @param {Object} params
   */
  delete = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const deletedCompany = await UserModel.findOneAndDelete({ _id: params.id });
      response = { data: deletedCompany, message: MESSAGE.DELETE };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name updateProfile
   * @param {Object} params
   */
  updateProfile = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { id, uid, cid, first_name, last_name, email, mobile } = params;

      // find user by id
      const user = await UserModel.findOne({ _id: id });
      if (!user) {
        throw new UnauthorizedAccessErrorResult(
          APP_ENUM.TYPE.ERROR.NOT_FOUND,
          MESSAGE.NOT_FOUND
        );
      }
      // check if email or mobile is already exist not in with same id
      const findUser = await UserModel.findOne({ $or: [{ email }, { mobile }], _id: { $ne: id } });
      if (findUser && findUser._id !== id) {
        throw new UnauthorizedAccessErrorResult(
          APP_ENUM.TYPE.ERROR.CONFLICT,
          MESSAGE.DUPLICATE_PHONE
        );
      }

      const updateModel = {
        $set: {
          first_name, last_name, email, mobile
        }
      };
      const updatedUser = await UserModel.findOneAndUpdate({ _id: uid }, updateModel, { new: true });
      response = { data: updatedUser, message: MESSAGE.UPDATE };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name changePassword
   * @param {Object} params
   */
  changePassword = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { uid, password, new_password } = params;

      // verify password  
      const user = await UserModel.findOne({ _id: uid });
      if (!user) {
        throw new UnauthorizedAccessErrorResult(
          APP_ENUM.TYPE.ERROR.NOT_FOUND,
          MESSAGE.NOT_FOUND
        );
      }
      const isPasswordMatch = await this.nx.crypto.verifyPassword(user.password, password);
      if (!isPasswordMatch) {
        throw new UnauthorizedAccessErrorResult(
          APP_ENUM.TYPE.ERROR.NOT_FOUND,
          MESSAGE.INVALID_PASSWORD
        );
      }
      const passwordHash = await this.nx.crypto.hashPassword(new_password);
      const updateModel = {
        $set: {
          password: passwordHash,
        }
      };
      const updatedUser = await UserModel.findOneAndUpdate({ _id: uid }, updateModel, { new: true });
      response = { data: updatedUser, message: MESSAGE.UPDATE };
      return response;
    } catch (error) {
      throw error;
    }
  }

}