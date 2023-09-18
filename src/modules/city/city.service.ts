import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { IResponseType } from "../../core/IResponseType.interface";
import CityModel from "../../models/city.model";
import { MESSAGE } from "../../shared/constants/app.const";
import { APP_ENUM } from "../../shared/enums/app.enum";
import { NxService } from "../../shared/nx-library/nx-service";

export class CityService {
  constructor(private nx: NxService) { }

  /**
   * @name findAll
   * @param {Object} params 
   */
  findAll = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
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
            ]
          }
        },
        {
          $lookup: {
            from: "states",
            localField: "state_id",
            foreignField: "_id",
            as: "state"
          }
        },
        {
          $unwind: "$state"
        },
        {
          $project: {
            _id: 1,
            name: 1,
            status: 1,
            state: {
              name: 1,
            }
          }
        },
        { $sort: sortQuery },
        { $skip: skip },
        { $limit: limitInt }
      ];

      const count = await CityModel.countDocuments(filterQuery[0].$match);
      const result = await CityModel.aggregate(filterQuery);
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
      const result = await CityModel.findOne({ _id: params.id });
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
      console.log('params', params);
      const { cid, uid, name, status, state_id } = params;

      // find State based on state name
      const findState = await CityModel.findOne({ name });
      if (findState) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.TYPE.ERROR.CONFLICT, MESSAGE.DUPLICATE_PHONE);
      }
      const createModel = new CityModel({
        name, state_id,
        status: +status,
        created_by: uid
      });
      const result = await createModel.save();
      response = { data: result, message: MESSAGE.CREATE };
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
      const { id, cid, uid, name, status, state_id } = params;

      const updateModel = {
        $set: {
          state_id, name,
          status: +status,
          updated_at: new Date(),
        }
      };

      const result = await CityModel.findOneAndUpdate({ _id: id }, updateModel, { new: true });
      response = { data: result, message: MESSAGE.UPDATE };
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
      const result = await CityModel.findOneAndDelete({ _id: params.id });
      response = { data: result, message: MESSAGE.DELETE };
      return response;
    } catch (error) {
      throw error;
    }
  }
}