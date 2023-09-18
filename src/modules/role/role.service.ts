import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { IResponseType } from "../../core/IResponseType.interface";
import RoleModel from "../../models/role.model";
import RolePermissionModel from "../../models/role-permission.model";
import { MESSAGE } from "../../shared/constants/app.const";
import { APP_ENUM } from "../../shared/enums/app.enum";
import { NxService } from "../../shared/nx-library/nx-service";

export class RoleService {
  constructor(private nx: NxService) { }

  /**
   * @name findAll
   * @param {Object} params 
   */
  findAll = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      console.log('params', params);
      const { cid, uid, page, limit, sort, sortBy, filter } = params;
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
            $or: [
              { name: { $regex: '.*' + filter + '.*', $options: "i" } },
              { description: { $regex: '.*' + filter + '.*', $options: "i" } }
            ]
          }
        }, {

          $project: {
            _id: 1,
            name: 1,
            description: 1,
            status: 1
          }
        },
        { $sort: sortQuery },
        { $skip: skip },
        { $limit: limitInt }
      ];

      const count = await RoleModel.countDocuments(filterQuery[0].$match);
      const result = await RoleModel.aggregate(filterQuery);
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
      const user = await RoleModel.findOne({ _id: id, company_id: cid, })
        .select('name description status');
      response = { data: user, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name findPermissionsByRoleId
   * @param {Object} params 
   */
  findPermissionsByRoleId = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { uid, cid, id } = params;
      const result: any = await RolePermissionModel.findOne({ roleId: id }).select('permissions');
      response = { data: result, message: MESSAGE.GET };
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
      const { uid, cid, name, description, status } = params;

      const findUser = await RoleModel.findOne({ name });
      if (findUser) {
        throw new UnauthorizedAccessErrorResult(
          APP_ENUM.TYPE.ERROR.CONFLICT,
          MESSAGE.DUPLICATE_PHONE
        );
      }
      const createModel = new RoleModel({
        name, description,
        status: +status,
        created_by: uid,
      });
      const createdRole = await createModel.save();
      response = { data: createdRole, message: MESSAGE.CREATE };
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @name createRoleToPermission
   * @param {Object} params
   */
  createRoleToPermission = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { uid, cid, role_id, permissions } = params;

      await RolePermissionModel.deleteMany({ roleId: role_id });
      const createModel = new RolePermissionModel({
        roleId: role_id,
        permissions,
        created_by: uid,
      });
      const createdModel = await createModel.save();

      response = { data: createdModel, message: MESSAGE.CREATE };
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
      const { id, uid, cid, name, description, status } = params;

      const updateModel = {
        $set: {
          name, description,
          status: +status,
          updated_by: uid,
          updated_at: new Date(),
        }
      };

      const updatedUser = await RoleModel.findOneAndUpdate({ _id: id }, updateModel, { new: true });
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
      await RolePermissionModel.deleteMany({ roleId: params.id });
      const deletedCompany = await RoleModel.findOneAndDelete({ _id: params.id });
      response = { data: deletedCompany, message: MESSAGE.DELETE };
      return response;
    } catch (error) {
      throw error;
    }
  }

}