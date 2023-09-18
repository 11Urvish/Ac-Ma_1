import { Types } from 'mongoose';
import { UnauthorizedAccessErrorResult } from '../../core/error-result';
import { IResponseType } from '../../core/IResponseType.interface';
import CustomerModel from '../../models/customer.model';
import { MESSAGE } from '../../shared/constants/app.const';
import { APP_ENUM } from '../../shared/enums/app.enum';
import { NxService } from '../../shared/nx-library/nx-service';

export class CustomerService {
  constructor(private nx: NxService) {}

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
        sortQuery[sortBy] = sort === APP_ENUM.SORT.ASC ? 1 : -1;
      } else {
        sortQuery['_id'] = -1;
      }

      const filterQuery: any[] = [
        {
          $match: {
            $or: [
              { 'name.en': { $regex: '.*' + filter + '.*', $options: 'i' } },
              { 'name.hi': { $regex: '.*' + filter + '.*', $options: 'i' } },
              { mobile: { $regex: '.*' + filter + '.*', $options: 'i' } },
              { email: { $regex: '.*' + filter + '.*', $options: 'i' } },
              {
                'address.state': {
                  $regex: '.*' + filter + '.*',
                  $options: 'i',
                },
              },
              {
                'address.district': {
                  $regex: '.*' + filter + '.*',
                  $options: 'i',
                },
              },
              {
                'address.city': {
                  $regex: '.*' + filter + '.*',
                  $options: 'i',
                },
              },
              {
                'address.taluka': {
                  $regex: '.*' + filter + '.*',
                  $options: 'i',
                },
              },
              {
                'address.village': {
                  $regex: '.*' + filter + '.*',
                  $options: 'i',
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            licence: 1,
            name: 1,
            email: 1,
            mobile: 1,
            status: 1,
            address: 1,
          },
        },
        { $sort: sortQuery },
        { $skip: skip },
        { $limit: limitInt },
      ];

      const count = await CustomerModel.countDocuments(filterQuery[0].$match);
      const result = await CustomerModel.aggregate(filterQuery);
      response = {
        message: MESSAGE.GET,
        data: { result, count },
      };
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name findById
   * @param {Object} params
   */
  findById = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const data: any = await CustomerModel.findOne({ _id: params.id });
      response = { data, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  };

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
      const sortQuery = { email: 1 };

      console.log(filter);

      const filterQuery: any[] = [
        {
          $match: {
            $or: [
              { 'name.en': { $regex: '.*' + filter + '.*', $options: 'i' } },
              { 'name.hi': { $regex: '.*' + filter + '.*', $options: 'i' } },
              { mobile: { $regex: '.*' + filter + '.*', $options: 'i' } },
              { email: { $regex: '.*' + filter + '.*', $options: 'i' } },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            mobile: 1,
          },
        },
        { $sort: sortQuery },
        { $skip: 0 },
        { $limit: limit },
      ];
      let result: any[] = await CustomerModel.aggregate(filterQuery);

      result = result.map((c: any) => {
        return { ...c, displayName: c.name.en + ' - ' + c.name.hi };
      });

      response = { data: result, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name create
   * @param {Object} params
   */
  create = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      console.log('params', params);
      const { uid, licence, name, email, mobile, address } = params;

      const findCustomer = await CustomerModel.findOne({
        $or: [{ email }, { mobile }],
      });
      console.log('findCustomer', findCustomer);
      if (findCustomer) {
        throw new UnauthorizedAccessErrorResult(
          APP_ENUM.TYPE.ERROR.CONFLICT,
          MESSAGE.DUPLICATE
        );
      }
      const createModel = new CustomerModel({
        licence,
        name,
        email,
        mobile,
        address,
        createdBy: uid,
      });
      const createdCompany = await createModel.save();
      response = { data: createdCompany, message: MESSAGE.CREATE };
      return response;
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   * @name update
   * @param {Object} params
   */
  update = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;

      const { uid, id, licence, name, email, mobile, address } = params;

      const updateModel = {
        $set: {
          licence,
          name,
          email,
          mobile,
          address,
          updatedBy: uid,
          updatedAt: new Date(),
        },
      };

      const updatedCustomer = await CustomerModel.findOneAndUpdate(
        { _id: id },
        updateModel,
        { new: true }
      );
      response = { data: updatedCustomer, message: MESSAGE.UPDATE };
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name delete
   * @param {Object} params
   */
  delete = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { id } = params;
      const updateModel = {
        $set: { status: APP_ENUM.STATUS.USER.DELETED, updated_at: new Date() },
      };
      await CustomerModel.findOneAndUpdate({ _id: id }, updateModel, {
        new: true,
      });
      response = { data: null, message: MESSAGE.DELETE };
      return response;
    } catch (error) {
      throw error;
    }
  };
}
