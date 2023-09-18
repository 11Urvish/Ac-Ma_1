import { IResponseType } from '../../core/IResponseType.interface';
import { MESSAGE } from '../../shared/constants/app.const';
import { NxService } from '../../shared/nx-library/nx-service';
import { APP_ENUM } from '../../shared/enums/app.enum';
import CustomerModel from '../../models/customer.model';
import RoleModel from '../../models/role.model';
import LoanModel from '../../models/loan.model';
import FirmModel from '../../models/firm.model';
import LoanTransferModel from '../../models/loan-transfer.model';
import { COUNTRY_LIST, STATE_LIST } from '../../shared/constants/region.const';

export class LookupService {
  constructor(private nx: NxService) {}

  /**
   * @name findCustomers
   * @memberof LookupService
   * @description find test lookup data
   */
  findCustomers = async () => {
    try {
      const result = await CustomerModel.find({ status: 1 })
        .select('first_name last_name mobile')
        .sort({ first_name: 1 });
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name findCountryLookup
   * @memberof LookupService
   * @description find Country lookup data
   */
  findCountryLookup = async () => {
    try {
      const result = await COUNTRY_LIST;
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name findStates
   * @memberof LookupService
   * @description find all states data
   */
  findStates = async () => {
    try {
      const result: any[] = await STATE_LIST.filter(
        (state) => state.country_id === 91 && state.status === 1
      );
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name findRoles
   * @memberof LookupService
   * @description find Role lookup data
   */
  findRoles = async () => {
    try {
      const result = await RoleModel.find({ status: 1 })
        .select('name description')
        .sort({ name: 1 });
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name findFirms
   * @memberof LookupService
   * @description find Firms lookup data
   */
  findFirms = async () => {
    try {
      const result = await FirmModel.find({ status: 1 })
        .select('name code')
        .sort({ name: 1 });
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name findPermissions
   * @memberof LookupService
   * @description find Role lookup data
   */
  findPermissions = async () => {
    try {
      const result: any[] = [
        {
          title: 'Dashboard',
          permissions: [
            { permissionId: 1001, status: true, name: 'Master Data' },
            { permissionId: 1002, status: true, name: 'Loan Status Chart' },
            { permissionId: 1003, status: true, name: 'Transaction Chart' },
            { permissionId: 1004, status: false, name: 'Metal Reports' },
          ],
        },
        {
          title: 'Customer',
          permissions: [
            { permissionId: 2001, status: true, name: 'Customer Listing' },
            { permissionId: 2002, status: true, name: 'Create' },
            { permissionId: 2003, status: true, name: 'Edit' },
            { permissionId: 2004, status: true, name: 'Delete' },
          ],
        },
        {
          title: 'Loan',
          permissions: [
            { permissionId: 3001, status: true, name: 'Loan Listing' },
            { permissionId: 3002, status: true, name: 'Create' },
            { permissionId: 3003, status: true, name: 'View' },
            { permissionId: 3004, status: true, name: 'Edit Transaction' },
          ],
        },
        {
          title: 'Firm',
          permissions: [
            { permissionId: 4001, status: true, name: 'Firm Listing' },
            { permissionId: 4002, status: true, name: 'Create' },
            { permissionId: 4003, status: true, name: 'Edit' },
            { permissionId: 4004, status: true, name: 'Delete' },
          ],
        },
        {
          title: 'Transfer Loan',
          permissions: [
            { permissionId: 5001, status: true, name: 'Transfer Loan Listing' },
            { permissionId: 5002, status: true, name: 'Create' },
            { permissionId: 5003, status: true, name: 'Edit' },
            { permissionId: 5004, status: true, name: 'Delete' },
          ],
        },
        {
          title: 'Reports',
          permissions: [
            { permissionId: 11001, status: true, name: 'Transaction Report' },
            { permissionId: 11002, status: false, name: 'Master Report' },
            { permissionId: 11003, status: false, name: 'Loan Report' },
            { permissionId: 11004, status: false, name: 'Payment Report' },
          ],
        },
      ];

      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name findStatesByCountryId
   * @memberof LookupService
   * @description Find all states by country id
   */
  findStatesByCountryId = async (params: any) => {
    try {
      let response: IResponseType;
      const { id } = params;
      const stateList: any[] = STATE_LIST;
      const data: any[] = await stateList.filter(
        (country: any) =>
          country.country_id === id &&
          country.status === APP_ENUM.STATUS.STATE.ACTIVE
      );
      response = { data, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name findLoanStatus
   * @memberof LookupService
   * @description Find all loan status
   */
  findLoanStatus = async () => {
    try {
      const filterActiveLoanQuery: any[] = [
        { $match: { status: APP_ENUM.STATUS.LOAN.ACTIVE } },
      ];
      const filterInActiveLoanQuery: any[] = [
        { $match: { status: APP_ENUM.STATUS.LOAN.CLOSED } },
      ];
      const activeLoanCount = await LoanModel.countDocuments(
        filterActiveLoanQuery[0].$match
      );
      const inActiveLoanCount = await LoanModel.countDocuments(
        filterInActiveLoanQuery[0].$match
      );
      console.log({ active: activeLoanCount, inActive: inActiveLoanCount });
      return { closed: inActiveLoanCount, open: activeLoanCount };
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name findMasterChartData
   * @memberof LookupService
   * @description Find all master chart data
   */
  findMasterChartData = async () => {
    try {
      const customerCount = await CustomerModel.countDocuments({
        status: APP_ENUM.STATUS.USER.ACTIVE,
      });
      const loanCount = await LoanModel.countDocuments({
        status: APP_ENUM.STATUS.LOAN.ACTIVE,
      });
      const firmCount = await FirmModel.countDocuments({
        status: APP_ENUM.STATUS.LOAN.ACTIVE,
      });
      const transferLoanCount = await LoanTransferModel.countDocuments({
        status: APP_ENUM.STATUS.LOAN.ACTIVE,
      });

      const response = {
        customer: customerCount,
        loan: loanCount,
        firm: firmCount,
        transfer_loan: transferLoanCount,
      };

      return response;
    } catch (error) {
      throw error;
    }
  };
}
