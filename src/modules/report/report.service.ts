import { IResponseType } from "../../core/IResponseType.interface";
import TransactionModel from "../../models/transaction.model";
import { MESSAGE } from "../../shared/constants/app.const";
import { NxService } from "../../shared/nx-library/nx-service";

export class ReportService {
  constructor(private nx: NxService) { }

  /**
   * @name findTransactionReport
   * @param {Object} params
   * @param {string} params.cid
   */
  findTransactionReport = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { cid, uid, page, limit, sort, sortBy } = params;
      const pageInt = parseInt(page, 10);
      const limitInt = parseInt(limit, 10);
      const { sDate, eDate, transactionType } = params;
      const skip = (pageInt - 1) * limit;
      const sortQuery = {};
      let transationTypes: any[] = [];
      let dateRange: any = {};

      if (sortBy) {
        sortQuery[sortBy] = sort === "ASC" ? 1 : -1;;
      } else {
        sortQuery["_id"] = -1;
      }

      let startDate = new Date(sDate);
      let endDate = new Date(eDate);
      endDate.setDate(endDate.getDate() + 1);

      dateRange = sDate && eDate ? { $gte: startDate, $lte: endDate } : sDate ? { $gte: startDate } : { $lte: endDate };

      if (transactionType === 0) {
        transationTypes = [1, 2];
      } else {
        transationTypes.push(transactionType);
      }

      const filterQuery: any[] = [
        {
          $match: {
            timestamp: dateRange,
            transaction_type: { $in: transationTypes }
          }
        },
        {
          $project: {
            _id: 1,
            transaction_id: 1,
            customer_id: 1,
            loan_id: 1,
            amount: 1,
            balance: 1,
            interest_amount: 1,
            principal_amount: 1,
            transaction_type: 1,
            description: 1,
            timestamp: 1
          }
        },
        {
          $lookup: {
            from: "loans",
            localField: "loan_id",
            foreignField: "_id",
            as: "loan"
          }
        },
        {
          $unwind: "$loan"
        },
        {
          $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "_id",
            as: "customer"
          }
        },
        {
          $unwind: "$customer"
        },
        {
          $project: {
            _id: 1,
            transaction_id: 1,
            customer_id: 1,
            loan_id: 1,
            amount: 1,
            balance: 1,
            interest_amount: 1,
            principal_amount: 1,
            transaction_type: 1,
            description: 1,
            timestamp: 1,
            customer: {
              _id: 1,
              first_name: 1,
              last_name: 1,
              mobile: 1,
            },
            loan: {
              _id: 1,
              loan_number: 1,
            }
          }
        },
        { $sort: sortQuery },
        { $skip: skip },
        { $limit: limitInt }
      ];

      const count = await TransactionModel.countDocuments(filterQuery[0].$match);
      const result = await TransactionModel.aggregate(filterQuery);
      response = { data: { result, count }, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name findInterestReport
   * @param {Object} params
   * @param {string} params.cid
   */
  findInterestReport = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { cid, uid, page, limit, sort, sortBy } = params;
      const pageInt = parseInt(page, 10);
      const limitInt = parseInt(limit, 10);
      const { sDate, eDate, transactionType } = params;
      const skip = (pageInt - 1) * limit;
      const sortQuery = {};
      let dateRange: any = {};

      if (sortBy) {
        sortQuery[sortBy] = sort === "ASC" ? 1 : -1;;
      } else {
        sortQuery["_id"] = -1;
      }

      let startDate = new Date(sDate);
      let endDate = new Date(eDate);
      endDate.setDate(endDate.getDate() + 1);

      dateRange = sDate && eDate ? { $gte: startDate, $lte: endDate } : sDate ? { $gte: startDate } : { $lte: endDate };


      const filterQuery = [
        {
          $match: {
            timestamp: dateRange,
            interest_amount: { $gt: 0 }
          },
        },
        {
          $project: {
            _id: 1,
            transaction_id: 1,
            customer_id: 1,
            loan_id: 1,
            interest_amount: 1,
            timestamp: 1
          }
        },
        {
          $lookup: {
            from: "loans",
            localField: "loan_id",
            foreignField: "_id",
            as: "loan"
          }
        },
        {
          $unwind: "$loan"
        },
        {
          $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "_id",
            as: "customer"
          }
        },
        {
          $unwind: "$customer"
        },
        {
          $group: {
            _id: {
              loan_id: "$loan_id", customer_id: "$customer_id",
              loan_number: "$loan.loan_number",
              first_name: "$customer.first_name",
              last_name: "$customer.last_name"
            },
            interest_amount: { $sum: "$interest_amount" },
          }
        },
        { $sort: sortQuery },
      ];

      const count = await TransactionModel.countDocuments(filterQuery);
      const result = await TransactionModel.aggregate(filterQuery);
      // const count = result.length;
      response = { data: { result, count }, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;

    }
  }

}