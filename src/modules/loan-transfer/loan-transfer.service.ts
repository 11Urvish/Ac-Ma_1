import { UnauthorizedAccessErrorResult } from '../../core/error-result';
import { IResponseType } from '../../core/IResponseType.interface';
import LoanTransferModel from '../../models/loan-transfer.model';
import LoanModel from '../../models/loan.model';
import { MESSAGE } from '../../shared/constants/app.const';
import { APP_ENUM } from '../../shared/enums/app.enum';
import { NxService } from '../../shared/nx-library/nx-service';

export class LoanTransferService {
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
          $lookup: {
            from: 'firms',
            localField: 'firm',
            foreignField: '_id',
            as: 'firm',
          },
        },
        {
          $unwind: '$firm',
        },
        {
          $project: {
            _id: 1,
            firm: 1,
            bundle_number: 1,
            status: 1,
            amount: 1,
            interest_rate: 1,
            transfer_date: 1,
            created_at: 1,
            loan_items: 1,
            firm_name: '$firm.name',
          },
        },
        { $sort: sortQuery },
        { $skip: skip },
        { $limit: limitInt },
      ];

      const count = await LoanTransferModel.countDocuments(
        filterQuery[0].$match
      );
      const result = await LoanTransferModel.aggregate(filterQuery);
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
      const { uid, cid, id } = params;
      const data = await LoanTransferModel.findOne({ _id: id });
      response = { data, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name findBundleId
   * @param {Object} params
   */
  findBundleId = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const loanTransferData = await LoanTransferModel.findOne(
        {},
        {},
        { sort: { bundle_number: -1 } }
      );
      const bundleNumber = loanTransferData
        ? loanTransferData.bundle_number + 1
        : 1001;
      response = { data: bundleNumber, message: MESSAGE.GET };
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
      const {
        uid,
        cid,
        firm,
        amount,
        bundle_number,
        interest_rate,
        transfer_date,
        loan_items,
        total_weight,
        total_item,
      } = params;

      const findLoanTransfer = await LoanTransferModel.findOne({
        bundle_number,
      });
      if (findLoanTransfer) {
        throw new UnauthorizedAccessErrorResult(
          APP_ENUM.TYPE.ERROR.CONFLICT,
          MESSAGE.DUPLICATE.replace('{0}', 'Bundle Number')
        );
      }

      const data = await LoanTransferModel.create({
        firm,
        amount,
        interest_rate,
        transfer_date,
        loan_items,
        total_weight,
        total_item,
        bundle_number: +bundle_number,
        status: 1,
        created_by: uid,
        updated_by: uid,
      });

      // update loanmodel multiple
      await LoanModel.updateMany(
        {
          loan_number: {
            $in: loan_items.map((item: any) => +item.loan_number),
          },
        },
        {
          $set: { is_loan_transfer: true, updated_by: uid },
        }
      );

      response = { data, message: MESSAGE.CREATE };
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
      const {
        uid,
        cid,
        id,
        firm,
        status,
        amount,
        total_weight,
        total_item,
        interest_rate,
        transfer_date,
        loan_items,
      } = params;

      const findLoanTransfer: any = await LoanTransferModel.findOne({
        _id: id,
      });

      if (!findLoanTransfer) {
        throw new UnauthorizedAccessErrorResult(
          APP_ENUM.TYPE.ERROR.CONFLICT,
          MESSAGE.NOT_FOUND
        );
      }

      let array1 = findLoanTransfer.loan_items.map(
        (item: any) => item.loan_number
      );

      let array2 = loan_items.map((item: any) => item.loan_number);

      let deletedLoanList: any[] = array1.filter(
        (item: any) => array2.indexOf(item) === -1
      );
      if (deletedLoanList.length > 0) {
        await LoanModel.updateMany(
          { loan_number: { $in: deletedLoanList } },
          {
            $set: { is_loan_transfer: false, updated_by: uid },
          }
        );
      }

      let newAddedLoanList: any[] = array2.filter(
        (item: any) => array1.indexOf(item) === -1
      );
      if (newAddedLoanList.length > 0) {
        await LoanModel.updateMany(
          { loan_number: { $in: newAddedLoanList } },
          {
            $set: { is_loan_transfer: true, updated_by: uid },
          }
        );
      }

      // update transferloan model
      const data = await LoanTransferModel.updateOne(
        { _id: id },
        {
          $set: {
            firm,
            status: +status,
            amount,
            interest_rate,
            transfer_date,
            loan_items,
            total_weight,
            total_item,
            updated_by: uid,
          },
        }
      );

      response = { data: data, message: MESSAGE.CREATE };
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
      // find LoanTransferModel by id
      const { uid, cid, id } = params;
      const findLoanTransfer: any = await LoanTransferModel.findOne({
        _id: id,
      });
      if (!findLoanTransfer) {
        throw new UnauthorizedAccessErrorResult(
          APP_ENUM.TYPE.ERROR.CONFLICT,
          MESSAGE.NOT_FOUND
        );
      }

      // update loanmodel multiple
      await LoanModel.updateMany(
        {
          loan_number: {
            $in: findLoanTransfer.loan_items.map(
              (item: any) => +item.loan_number
            ),
          },
        },
        {
          $set: { is_loan_transfer: false, updated_by: uid },
        }
      );

      const deletedCompany = await LoanTransferModel.findOneAndDelete({
        _id: params.id,
      });
      response = { data: deletedCompany, message: MESSAGE.DELETE };
      return response;
    } catch (error) {
      throw error;
    }
  };
}
