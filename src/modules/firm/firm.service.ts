import { Types } from "mongoose";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { IResponseType } from "../../core/IResponseType.interface";
import FirmModel from "../../models/firm.model";
import { MESSAGE } from "../../shared/constants/app.const";
import { APP_ENUM } from "../../shared/enums/app.enum";
import { NxService } from "../../shared/nx-library/nx-service";

export class FirmService {
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
              { code: { $regex: '.*' + filter + '.*', $options: "i" } },
              { contact_person: { $regex: '.*' + filter + '.*', $options: "i" } },
              { mobile: { $regex: '.*' + filter + '.*', $options: "i" } },
            ]
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            code: 1,
            contact_person: 1,
            email: 1,
            mobile: 1,
            status: 1,
            note: 1,
            created_at: 1,
          }
        },
        { $sort: sortQuery },
        { $skip: skip },
        { $limit: limitInt }
      ];

      const count = await FirmModel.countDocuments(filterQuery[0].$match);
      const result = await FirmModel.aggregate(filterQuery);
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
      const firmData = await FirmModel.findOne({ _id: params.id })
        .select('_id name code contact_person mobile email status note created_at');
      response = { data: firmData, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name findByValue
   * @param params 
   * @returns 
   */
  findByValue = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { cid, uid, filter } = params;
      const limit = 15;
      const sortQuery = { first_name: 1 };

      const filterQuery: any[] = [
        {
          $match: {
            $or: [
              { name: { $regex: '.*' + filter + '.*', $options: "i" } },
              { code: { $regex: '.*' + filter + '.*', $options: "i" } },
              { mobile: { $regex: '.*' + filter + '.*', $options: "i" } }
            ]
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            code: 1,
            mobile: 1,
            contact_person: 1,
          }
        },
        { $sort: sortQuery },
        { $skip: 0 },
        { $limit: limit }
      ];
      const result = await FirmModel.aggregate(filterQuery);
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
      const { cid, uid, name, code, contact_person, status, email, mobile, note } = params;

      // find Customer based on company id and email or mobile
      const findFirmData = await FirmModel.findOne({ company_id: cid, $or: [{ mobile }] });
      console.log('findFirmData', findFirmData);
      if (findFirmData) {
        throw new UnauthorizedAccessErrorResult(
          APP_ENUM.TYPE.ERROR.CONFLICT,
          MESSAGE.DUPLICATE_PHONE
        );
      }
      const createModel = new FirmModel({
        name, code, contact_person, email, mobile, note,
        status: +status,
        created_by: uid
      });
      const createdFirm = await createModel.save();
      response = { data: createdFirm, message: MESSAGE.CREATE };
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
      const { id, name, code, contact_person, status, email, mobile, note } = params;

      const updateModel = {
        $set: {
          name, code, contact_person, status, email, mobile, note,
          updated_at: new Date()
        }
      };

      const updatedFirm = await FirmModel.findOneAndUpdate({ _id: id }, updateModel, { new: true });
      response = { data: updatedFirm, message: MESSAGE.UPDATE };
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
      const { id } = params;
      const updateModel = {
        $set: { status: APP_ENUM.STATUS.USER.DELETED, updated_at: new Date() }
      };
      await FirmModel.findOneAndUpdate({ _id: id }, updateModel, { new: true });
      response = { data: null, message: MESSAGE.DELETE };
      return response;
    } catch (error) {
      throw error;
    }
  }


}