import { Types } from 'mongoose';
import {
  InternalServerErrorResult,
  UnauthorizedAccessErrorResult,
} from '../../core/error-result';
import { IResponseType } from '../../core/IResponseType.interface';
import { TransactionBlock } from '../../core/transaction-block';

import LoanModel from '../../models/loan.model';
import TransactionModel from '../../models/transaction.model';
import UserModel from '../../models/user.model';
import CustomerModel from '../../models/customer.model';
import { MESSAGE } from '../../shared/constants/app.const';
import { APP_ENUM } from '../../shared/enums/app.enum';
import { NxService } from '../../shared/nx-library/nx-service';
import { ProgressReportType } from '../../types/progress-report.type';

export class LoanService {
  constructor(private nx: NxService) { }

  /**
   * @name findAll
   * @param {Object} params
   */
  findAll = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;

      const { page, limit, sort, sortBy, filter } = params;
      const { id, searchKey } = filter;
      const pageInt = parseInt(page, 10);
      const limitInt = parseInt(limit, 10);
      const skip = (pageInt - 1) * limitInt;
      const sortQuery = {};

      // aggregate query with match, project and lookup for laon and customer
      if (sortBy) {
        sortQuery[sortBy] = sort === APP_ENUM.SORT.ASC ? 1 : -1;
      } else {
        sortQuery['customer_id'] = -1;
      }
      const filterQuery: any[] = [
        {
          $match: {},
        },
        {
          $project: {
            _id: 1,
            customerId: 1,
            loanNumber: 1,
            loanAmount: 1,
            interestRate: 1,
            loanStartDate: 1,
            loanEndDate: 1,
            financialYear: 1,
            client: 1,
            morgageItems: 1,
          },
        },
        {
          $lookup: {
            from: 'customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        { $unwind: '$customer' },
        {
          $project: {
            _id: 1,
            customerId: 1,
            loanNumber: 1,
            loanAmount: 1,
            interestRate: 1,
            loanStartDate: 1,
            loanEndDate: 1,
            financialYear: 1,
            client: 1,
            morgageItems: 1,
            customer: {
              _id: 1,
              name: 1,
              mobile: 1,
              email: 1,
              address: 1,
            },
          },
        },
        { $sort: sortQuery },
        { $skip: skip },
        { $limit: limitInt },
      ];

      console.log(filterQuery);

      if (id) {
        filterQuery[0].$match.customer_id = new Types.ObjectId(id);
      }

      const count = await LoanModel.countDocuments(filterQuery[0].$match);
      const result = await LoanModel.aggregate(filterQuery);
      response = {
        message: MESSAGE.GET,
        data: { result, count },
      };
      console.log('SHOW');
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
      const data: any = await LoanModel.findById({ _id: params.id }).populate('customerId')
      response = { data, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }


  };

  /**
   * @name findLoanNumber
   * @param {Object} params 
   */
  findUniqueLoanNumber = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;

      const loan = await LoanModel.findOne({}, {}, { sort: { 'loanNumber': -1 } });
      const loanNumberValue = loan ? loan.loanNumber + 1 : 100001;
      response = { data: loanNumberValue, message: MESSAGE.GET };
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
      const {
        uid,
        customerId,
        loanNumber,
        loanAmount,
        interestRate,
        loanStartDate,
        loanEndDate,
        financialYear,
        client,
        morgageItems,
      } = params;

      const loanModel = new LoanModel({
        customerId,
        loanNumber,
        loanAmount,
        interestRate,
        loanStartDate,
        loanEndDate,
        financialYear,
        client,
        morgageItems,
        createdBy: uid,
      });
      const createdCompany = await loanModel.save();
      response = { data: createdCompany, message: MESSAGE.CREATE };
      response = { data: null, message: MESSAGE.CREATE };
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
      console.log('params', params);
      const {
        uid,
        id,
        customerId,
        loanNumber,
        loanAmount,
        interestRate,
        loanStartDate,
        loanEndDate,
        financialYear,
        client,
        morgageItems,
      } = params;
      const updateModel = {
        $set: {
          customerId,
          loanNumber,
          loanAmount,
          interestRate,
          loanStartDate,
          loanEndDate,
          financialYear,
          client,
          morgageItems,
          updatedBy: uid,
          updatedAt: new Date(),
        },
      };

      const updatedLoan = await LoanModel.findOneAndUpdate(
        { _id: id },
        updateModel,
        { new: true }
      );
      response = { data: updatedLoan, message: MESSAGE.UPDATE };
      return response;
    } catch (error) {
      throw new Error(error);
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
      // const updateModel = {
      //   $set: { status: APP_ENUM.STATUS.USER.DELETED, updated_at: new Date() },
      // };
      // await LoanModel.findOneAndUpdate({ _id: id }, updateModel, { new: true });
      await LoanModel.findByIdAndDelete({ _id: id });
      response = { data: null, message: MESSAGE.DELETE };
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name exportLoan
   * @param {Object} params
   */
  exportLoan = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { sort, sortBy, filter } = params;
      const sortQuery = {};

      if (sortBy) {
        sortQuery[sortBy] = sort === APP_ENUM.SORT.ASC ? 1 : -1;
      } else {
        sortQuery['loanNumber'] = 1;
      }

      const filterQuery: any[] = [
        {
          $match: {
            $or: [
              { description: { $regex: '.*' + filter + '.*', $options: 'i' } },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            loanNumber: 1,
            loanAmount: 1,
            interestRate: 1,
            issueDate: 1,
            maturityDate: 1,
            loanPeriod: 1,
          },
        },
        {
          $lookup: {
            from: 'customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $unwind: '$customer',
        },
        {
          $project: {
            customerId: 1,
            loanNumber: 1,
            loanAmount: 1,
            interestRate: 1,
            issueDate: 1,
            maturityDate: 1,
            loanPeriod: 1,
            customer: {
              name: 1,
              mobile: 1,
            },
          },
        },
        { $sort: sortQuery },
      ];

      const filteredData = await LoanModel.aggregate(filterQuery);

      const result = filteredData.map((item: any) => {
        const {
          loanNumber,
          loanAmount,
          interestRate,
          issueDate,
          maturityDate,
          loanPeriod,
          morgageDetails,
          customer,
        } = item;
        return {
          loanNumber,
          loanAmount,
          interestRate,
          issueDate,
          maturityDate,
          loanPeriod,
          morgageDetails,
          name: customer.name,
          mobile: customer.mobile,
        };
      });

      response = {
        message: MESSAGE.GET,
        data: { result },
      };
      return response;
    } catch (error) {
      throw error;
    }
  };


  /**
     * @name exportForm
     * @param {Object} params
     */
  exportForm = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { id } = params;
      console.log(params)


      const filterQuery: any[] = [
        {
          $match: { _id: new Types.ObjectId(id) }
          //{ _id: (params.id) } 
        },
        // {
        //   $project: {
        //     loanNumber: 1,
        //     loanAmount: 1,
        //     interestRate: 1,
        //     loanStartDate: 1,
        //     loanEndDate: 1,
        //     //loanPeriod: 1,
        //     loanType: 1,
        //     morgageItems: { name: 1, value: 1, weight: 1 },
        //     client: 1,
        //   },
        // },
        {
          $lookup: {
            from: 'customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $unwind: '$customer',
        },
        {
          $project: {
            customer: {
              name: 1,
              licence: 1,
              address: 1,
              mobile: 1,
              email: 1,
            },
            client: {
              name: 1,
              mobile: 1,
              email: 1,
              address: 1,
            },
            loanNumber: 1,
            loanAmount: 1,
            interestRate: 1,
            loanStartDate: 1,
            loanEndDate: 1,
            //loanPeriod: 1,
          },
        },
      ];

      const result = await LoanModel.aggregate(filterQuery);
      response = {
        message: MESSAGE.GET,
        data: result.length > 0 ? result[0] : {}
        //data: { result },
      };
      return response;
    } catch (error) {
      throw error;
    }
  };

}




