import { Types } from 'mongoose';
import { InternalServerErrorResult, UnauthorizedAccessErrorResult } from "../../core/error-result";
import { IResponseType } from "../../core/IResponseType.interface";
import { TransactionBlock } from "../../core/transaction-block";
import TransactionModel from "../../models/transaction.model";
import LoanModel from "../../models/loan.model";
import { MESSAGE } from "../../shared/constants/app.const";
import { APP_ENUM } from "../../shared/enums/app.enum";
import { NxService } from "../../shared/nx-library/nx-service";

export class TransactionService {
  constructor(private nx: NxService) { }

  /**
   * @name findByLoanId
   * @param {Object} params 
   */
  findByLoanId = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { uid, cid, id } = params;

      const loan_id = new Types.ObjectId(id);
      const filterQuery: any[] = [
        {
          $match: { loan_id }
        },
        {
          $project: {
            _id: 1,
            loan_id: 1,
            amount: 1,
            balance: 1,
            interest_amount: 1,
            principal_amount: 1,
            transaction_type: 1,
            is_interest_paid: 1,
            description: 1,
            timestamp: 1,
          }
        },
        { $sort: { _id: -1 } }
      ];

      const transactionsData = await LoanModel.aggregate(filterQuery);
      console.log('transactionsData', transactionsData);
      // find all transactions by loan id
      const transactions = await TransactionModel.find({ loan_id: id }).sort({ _id: -1 });
      response = { data: transactions, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name findWithdrawInterestByLoanId
   * @param {Object} params 
   */
  findWithdrawInterestByLoanId = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;
      const { uid, cid, id } = params;

      const loan_id = new Types.ObjectId(id);
      const filterQuery: any[] = [
        {
          $match: {
            loan_id,
            is_interest_paid: false,
            transaction_type: APP_ENUM.TYPE.TRANSATION.DEBIT
          }
        },
        {
          $project: {
            _id: 1,
            loan_id: 1,
            amount: 1,
            balance: 1,
            interest_amount: 1,
            principal_amount: 1,
            transaction_type: 1,
            is_interest_paid: 1,
            description: 1,
            timestamp: 1,
          }
        }
      ];

      const transactions = await TransactionModel.aggregate(filterQuery)
      response = { data: transactions, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name createDeposite
   * @param params 
   * @returns 
   */
  createDeposite = async (params: any): Promise<IResponseType> => {
    try {
      const ERROR = APP_ENUM.TYPE.ERROR;

      let response: IResponseType;

      const transaction_type = APP_ENUM.TYPE.TRANSATION.CREDIT;
      const { uid, cid, id, amount, payment_type, payment_date } = params;
      const loan_id = new Types.ObjectId(id);
      let payAmount: number = Math.floor(+amount);
      const paymentDate = new Date(payment_date);
      console.log('payAmount', payAmount);

      let dateDiff: { year: number, month: number, day: number } = { year: 0, month: 0, day: 0 };
      let monthDiff: number = 0;
      let payableInterestAmount: number = 0;
      let payablePrincipalAmount: number = 0;
      let payableTotalAmount: number = 0;
      let remainingPrincipalAmount: number = 0;
      let transactionNote: string;
      let remainingWithdrawInterestAmount: number = 0;

      if (payAmount <= 0) {
        throw new InternalServerErrorResult(ERROR.INTERNAL_SERVER_ERROR, MESSAGE.INVALID_AMOUNT);
      }

      const loanTransactions = await TransactionModel.find({ loan_id: loan_id, transaction_type: APP_ENUM.TYPE.TRANSATION.DEBIT, is_interest_paid: false });
      if (loanTransactions.length > 0) {
        remainingWithdrawInterestAmount = loanTransactions.reduce((acc, curr) => {
          return acc + curr.interest_amount;
        }, 0);
        remainingWithdrawInterestAmount = Math.floor(remainingWithdrawInterestAmount);
        console.log('remainingWithdrawInterestAmount', remainingWithdrawInterestAmount);
      }

      payAmount = payAmount - remainingWithdrawInterestAmount;

      const loan: any = await LoanModel.findOne({ _id: loan_id });
      if (!loan) {
        throw new InternalServerErrorResult(ERROR.INTERNAL_SERVER_ERROR, MESSAGE.NOT_FOUND);
      }

      const { customer_id, principal_amount, interest_rate, paid_till_date, status } = loan;
      const paidTillDate = new Date(paid_till_date);
      console.log('loan', loan);

      if (status !== APP_ENUM.STATUS.LOAN.ACTIVE) {
        throw new InternalServerErrorResult(APP_ENUM.TYPE.ERROR.CONFLICT, MESSAGE.LOAN_NOT_ACTIVE);
      }

      dateDiff = this.nx.date.getDateDiff(paidTillDate, paymentDate);
      if (dateDiff.year > 0) { monthDiff = dateDiff.year * 12; }
      if (dateDiff.month > 0) { monthDiff = monthDiff + dateDiff.month; }
      if (dateDiff.day > 0) { monthDiff = (dateDiff.day <= 15) ? monthDiff + 0.5 : monthDiff + 1; }
      console.log('monthDiff', monthDiff);

      payableInterestAmount = this.nx.math.calculateInterestAmount(principal_amount, interest_rate, monthDiff);
      payableInterestAmount = Math.floor(payableInterestAmount);
      console.log('payableInterestAmount', payableInterestAmount);

      payablePrincipalAmount = payAmount - payableInterestAmount;
      payablePrincipalAmount = Math.floor(payablePrincipalAmount);
      console.log('payablePrincipalAmount', payablePrincipalAmount);

      payableTotalAmount = principal_amount + payableInterestAmount;
      payableTotalAmount = Math.floor(payableTotalAmount);
      console.log('payableTotalAmount', payableTotalAmount);

      remainingPrincipalAmount = principal_amount - payablePrincipalAmount;
      remainingPrincipalAmount = Math.floor(remainingPrincipalAmount);
      console.log('remainingPrincipalAmount', remainingPrincipalAmount);


      if (payment_type === APP_ENUM.TYPE.PAYMENT.FULL_PAYMENT) {
        console.log('full payment');
        console.log('payableTotalAmount', payableTotalAmount);
        console.log('payAmount', payAmount);
        if (payableTotalAmount !== payAmount) {
          throw new InternalServerErrorResult(ERROR.INTERNAL_SERVER_ERROR, MESSAGE.PAYMENT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_LOAN_AMOUNT);
        }
        transactionNote = MESSAGE.FULL_PAYMENT.replace('{0}', loan.loan_number);
      } else if (payment_type === APP_ENUM.TYPE.PAYMENT.INTEREST_PAYMENT) {
        if (payableInterestAmount !== payAmount) {
          throw new InternalServerErrorResult(ERROR.INTERNAL_SERVER_ERROR, MESSAGE.PAYMENT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_INTEREST_AMOUNT);
        }
        transactionNote = MESSAGE.PART_PAYMENT.replace('{0}', loan.loan_number);
      } else if (payment_type === APP_ENUM.TYPE.PAYMENT.PART_PAYMENT) {
        if (payAmount > payableTotalAmount) {
          throw new InternalServerErrorResult(ERROR.INTERNAL_SERVER_ERROR, MESSAGE.PAYMENT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_LOAN_AMOUNT);
        }
        transactionNote = MESSAGE.PART_PAYMENT.replace('{0}', loan.loan_number);
      }

      const existingIDs = await TransactionModel.find().select('transaction_id');
      const generateUniqueID = () => {
        let uniqueID = this.nx.utils.generateUniqueId(10);
        if (existingIDs.find(id => id.transaction_id === uniqueID)) {
          while (existingIDs.find(id => id.transaction_id === uniqueID)) {
            uniqueID = this.nx.utils.generateUniqueId(10);
            if (!existingIDs.find(id => id.transaction_id === uniqueID)) {
              break;
            }
          }
        }
        return uniqueID;
      }
      const uniqueTransactionID = generateUniqueID();

      let precedingHash = '0';
      const transactions: any[] = await TransactionModel.find().sort({ timestamp: -1 }).limit(1);
      if (transactions.length > 0) {
        precedingHash = transactions[0]['hash'];
      }

      const transactionBlock: any = new TransactionBlock(
        uniqueTransactionID, customer_id, loan_id.toString(), payAmount, payableInterestAmount,
        payablePrincipalAmount, remainingPrincipalAmount, transaction_type, true,
        precedingHash, paymentDate, transactionNote);

      const transaction = new TransactionModel(transactionBlock);
      await transaction.save();

      const updateLoan = {
        paid_till_date: paymentDate,
        principal_amount: remainingPrincipalAmount,
        status: (remainingPrincipalAmount === 0) ? APP_ENUM.STATUS.LOAN.CLOSED : APP_ENUM.STATUS.LOAN.ACTIVE,
      };
      await LoanModel.findOneAndUpdate({ _id: loan_id }, updateLoan);

      // update many transactions
      const updateTransactions = {
        is_interest_paid: true,
      };
      await TransactionModel.updateMany({ loan_id: loan_id, transaction_type: APP_ENUM.TYPE.TRANSATION.DEBIT, is_interest_paid: false }, updateTransactions);

      response = { data: null, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name createWithdraw
   * @param params 
   * @returns 
   */
  createWithdraw = async (params: any): Promise<IResponseType> => {
    try {
      const ERROR = APP_ENUM.TYPE.ERROR;
      let response: IResponseType;

      const transaction_type = APP_ENUM.TYPE.TRANSATION.DEBIT;
      const { uid, cid, id, amount, payment_date } = params;
      const loan_id = new Types.ObjectId(id);
      let payAmount: number = Math.floor(+amount);
      const paymentDate = new Date(payment_date);

      let dateDiff: { year: number, month: number, day: number } = { year: 0, month: 0, day: 0 };
      let monthDiff: number = 0;
      let payableInterestAmount: number = 0;
      let payablePrincipalAmount: number = 0;
      let totalLoanAmount: number = 0;

      // let payableTotalAmount: number = 0;
      // let remainingPrincipalAmount: number = 0;
      let transactionNote: string = MESSAGE.WITHDRAW_AMOUNT.replace('{0}', 'Loan');

      if (payAmount <= 0) {
        throw new InternalServerErrorResult(ERROR.INTERNAL_SERVER_ERROR, MESSAGE.INVALID_AMOUNT);
      }



      const loan: any = await LoanModel.findOne({ _id: loan_id });
      if (!loan) {
        throw new InternalServerErrorResult(ERROR.INTERNAL_SERVER_ERROR, MESSAGE.NOT_FOUND);
      }

      const { loan_number, loan_amount, customer_id, principal_amount, interest_rate, paid_till_date, status } = loan;
      const paidTillDate = new Date(paid_till_date);
      transactionNote = MESSAGE.WITHDRAW_AMOUNT.replace('{0}', loan_number);
      console.log('loan', loan);

      if (status !== APP_ENUM.STATUS.LOAN.ACTIVE) {
        throw new InternalServerErrorResult(APP_ENUM.TYPE.ERROR.CONFLICT, MESSAGE.LOAN_NOT_ACTIVE);
      }

      dateDiff = this.nx.date.getDateDiff(paidTillDate, paymentDate);
      if (dateDiff.year > 0) { monthDiff = dateDiff.year * 12; }
      if (dateDiff.month > 0) { monthDiff = monthDiff + dateDiff.month; }
      if (dateDiff.day > 0) {
        let dayPercentage: number = (dateDiff.day / 30);
        dayPercentage = +(Math.round(dayPercentage * 100) / 100).toFixed(2);
        monthDiff += dayPercentage;
      }
      console.log('monthDiff', monthDiff);

      payableInterestAmount = this.nx.math.calculateInterestAmount(principal_amount, interest_rate, monthDiff);
      payableInterestAmount = Math.floor(payableInterestAmount);
      console.log('payableInterestAmount', payableInterestAmount);

      payablePrincipalAmount = principal_amount + payAmount
      payablePrincipalAmount = Math.floor(payablePrincipalAmount);
      console.log('payablePrincipalAmount', payablePrincipalAmount);

      totalLoanAmount = loan_amount + payAmount;
      totalLoanAmount = Math.floor(totalLoanAmount);

      // payableTotalAmount = principal_amount + payableInterestAmount + payableInterestAmount;;
      // payableTotalAmount = Math.floor(payableTotalAmount);
      // console.log('payableTotalAmount', payableTotalAmount);

      // remainingPrincipalAmount = principal_amount + payAmount + payableInterestAmount;
      // remainingPrincipalAmount = Math.floor(remainingPrincipalAmount);
      // console.log('remainingPrincipalAmount', remainingPrincipalAmount);

      const existingIDs = await TransactionModel.find().select('transaction_id');
      const generateUniqueID = () => {
        let uniqueID = this.nx.utils.generateUniqueId(10);
        if (existingIDs.find(id => id.transaction_id === uniqueID)) {
          while (existingIDs.find(id => id.transaction_id === uniqueID)) {
            uniqueID = this.nx.utils.generateUniqueId(10);
            if (!existingIDs.find(id => id.transaction_id === uniqueID)) {
              break;
            }
          }
        }
        return uniqueID;
      }
      const uniqueTransactionID = generateUniqueID();

      let precedingHash = '0';
      const transactions: any[] = await TransactionModel.find().sort({ timestamp: -1 }).limit(1);
      if (transactions.length > 0) {
        precedingHash = transactions[0]['hash'];
      }

      const transactionBlock: any = new TransactionBlock(
        uniqueTransactionID, customer_id, loan_id.toString(), payAmount, payableInterestAmount,
        payablePrincipalAmount, payablePrincipalAmount, transaction_type, false,
        precedingHash, paymentDate, transactionNote);

      const transaction = new TransactionModel(transactionBlock);
      await transaction.save();

      const updateLoan = {
        paid_till_date: paymentDate,
        principal_amount: payablePrincipalAmount,
        loan_amount: totalLoanAmount,
        status: APP_ENUM.STATUS.LOAN.ACTIVE,
      };
      await LoanModel.findOneAndUpdate({ _id: loan_id }, updateLoan);


      response = { data: null, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name createWithdrawTransaction
   * @param params 
   * @returns 
   */
  createWithdrawTransaction = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType = { data: null, message: '' };
      let totalPrincipalAmount: number = 0, totalLoanAmount: number = 0;
      let calculatedInterestAmount: number = 0;
      let monthDiff: number = 0;
      const { uid, cid, id, amount, withdraw_date } = params;
      const transaction_type = APP_ENUM.TYPE.TRANSATION.DEBIT;
      console.log('params', params);

      if (!amount) {
        throw new InternalServerErrorResult(APP_ENUM.TYPE.ERROR.INTERNAL_SERVER_ERROR, MESSAGE.INVALID_AMOUNT);
      }
      const amount_num = Number(amount);
      if (isNaN(amount_num)) {
        throw new InternalServerErrorResult(APP_ENUM.TYPE.ERROR.INTERNAL_SERVER_ERROR, MESSAGE.INVALID_AMOUNT);
      }
      if (amount <= 0) {
        throw new InternalServerErrorResult(APP_ENUM.TYPE.ERROR.INTERNAL_SERVER_ERROR, MESSAGE.INVALID_AMOUNT);
      }
      console.log('amount', amount);

      const existingIDs = await TransactionModel.find().select('transaction_id');
      const generateUniqueID = () => {
        let uniqueID = this.nx.utils.generateUniqueId(10);
        if (existingIDs.find(id => id.transaction_id === uniqueID)) {
          while (existingIDs.find(id => id.transaction_id === uniqueID)) {
            uniqueID = this.nx.utils.generateUniqueId(10);
            if (!existingIDs.find(id => id.transaction_id === uniqueID)) {
              break;
            }
          }
        }
        return uniqueID;
      }
      const uniqueTransactionID = generateUniqueID();
      console.log('uniqueTransactionID', uniqueTransactionID);

      const currLoan: any = await LoanModel.findOne({ _id: id });
      if (!currLoan) {
        throw new InternalServerErrorResult(APP_ENUM.TYPE.ERROR.CONFLICT, MESSAGE.NOT_FOUND);
      }
      console.log('currLoan', currLoan);
      const { customer_id, principal_amount, loan_amount, interest_rate, status, issue_date, paid_till_date } = currLoan;

      if (status !== APP_ENUM.STATUS.LOAN.ACTIVE) {
        throw new InternalServerErrorResult(APP_ENUM.TYPE.ERROR.CONFLICT, MESSAGE.LOAN_NOT_ACTIVE);
      }

      const paidTillDate = new Date(paid_till_date);
      const withdrawDate = new Date(withdraw_date);

      const dateDifference: { year: number, month: number, day: number } = this.nx.date.getDateDiff(paidTillDate, withdrawDate);
      console.log('=================dateDifference==============');
      console.log(dateDifference);

      if (dateDifference.year > 0) {
        monthDiff += dateDifference.year * 12;
      }
      if (dateDifference.month > 0) {
        monthDiff += dateDifference.month;
      }
      if (dateDifference.day > 0) {
        let dayPercentage: number = (dateDifference.day / 30);
        dayPercentage = +Math.floor(dayPercentage);
        monthDiff += dayPercentage;
      }

      calculatedInterestAmount = this.nx.math.calculateInterestAmount(principal_amount, interest_rate, monthDiff);
      calculatedInterestAmount = Math.floor(calculatedInterestAmount);
      console.log('calculatedInterestAmount ==>', calculatedInterestAmount);

      totalPrincipalAmount = principal_amount + amount + calculatedInterestAmount;
      totalPrincipalAmount = Math.floor(totalPrincipalAmount);
      console.log('totalPrincipalAmount', totalPrincipalAmount);

      totalLoanAmount = loan_amount + amount;
      totalLoanAmount = Math.floor(totalLoanAmount);
      console.log('totalLoanAmount', totalLoanAmount);

      let precedingHash = '0';
      const transactions: any[] = await TransactionModel.find().sort({ timestamp: -1 }).limit(1);
      if (transactions.length > 0) {
        precedingHash = transactions[0]['hash'];
      }
      const transactionNote = `Re-Payment #${currLoan.loan_number}`;
      const transactionBlock: any = new TransactionBlock(
        uniqueTransactionID, customer_id, id, amount, calculatedInterestAmount, amount,
        totalPrincipalAmount, transaction_type, false, precedingHash, withdrawDate, transactionNote
      );
      const createRecipientTransactionBlock = new TransactionModel(transactionBlock);
      await createRecipientTransactionBlock.save();

      const updateLoanModel = {
        $set: {
          loan_amount: totalLoanAmount,
          principal_amount: totalPrincipalAmount,
          paid_till_date: withdrawDate,
          status: APP_ENUM.STATUS.LOAN.ACTIVE,
        }
      };
      const updateLoanModelOptions = { new: true };
      await LoanModel.findByIdAndUpdate(id, updateLoanModel, updateLoanModelOptions);
      response = { data: null, message: MESSAGE.GET };
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
      const TRANSACTION_TYPE = APP_ENUM.TYPE.TRANSATION;


      const existingIDs = await TransactionModel.find().select('transaction_id');
      const transaction_id = this.nx.utils.generateUniqueId(10);

      const generateUniqueID = () => {
        let uniqueID = this.nx.utils.generateUniqueId(10);
        if (existingIDs.find(id => id.transaction_id === uniqueID)) {
          while (existingIDs.find(id => id.transaction_id === uniqueID)) {
            uniqueID = this.nx.utils.generateUniqueId(10);
            if (!existingIDs.find(id => id.transaction_id === uniqueID)) {
              break;
            }
          }
        }
        return uniqueID;
      }
      const uniqueTransactionID = generateUniqueID();

      let response: IResponseType;
      const { cid, uid, id, transaction_type, payment_date } = params;
      const amount = parseFloat(params.amount);

      console.log('params', params);

      const loan = await LoanModel.findOne({ _id: id });
      if (!loan) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.TYPE.ERROR.CONFLICT, MESSAGE.DUPLICATE_PHONE);
      }
      const { customer_id } = loan;

      if (transaction_type === TRANSACTION_TYPE.CREDIT) { // Lena
        if (loan.loan_amount < amount) {
          throw new UnauthorizedAccessErrorResult(APP_ENUM.TYPE.ERROR.CONFLICT, MESSAGE.INSUFFICIENT_BALANCE);
        }

        let precedingHash = '0';
        const transactions: any[] = await TransactionModel.find().sort({ timestamp: -1 }).limit(1);
        if (transactions.length > 0) {
          precedingHash = transactions[0]['hash'];
        }
        let transactionNote = `Part Payment of Loan #${loan.loan_number}`;

        let loanMonth = new Date(loan.issue_date).getMonth() + 1;
        let loanYear = new Date(loan.issue_date).getFullYear();

        const d = new Date(payment_date);
        const currentMonth = d.getMonth() + 1;
        const currentYear = d.getFullYear();

        if (loan.paid_till_month === 0 && loan.paid_till_year === 0) {
          transactionNote = `First Payment of Loan #${loan.loan_number}`;
        } else {
          loanMonth = loan.paid_till_month;
          loanYear = loan.paid_till_year;
          const paidTill = `${currentMonth}/${currentYear}`;
          transactionNote = `Part Payment of Loan #${loan.loan_number} till ${paidTill}`;
        }

        let monthDiff = 0;
        let yearDiff = 0;
        if (currentYear === loanYear) {
          if (currentMonth > loanMonth) {
            monthDiff = currentMonth - loanMonth;
          } else {
            monthDiff = 1;
          }
        } else if (currentYear > loanYear) {
          yearDiff = currentYear - loanYear;
        }

        // get interested

        const loanAmount = +(loan.loan_amount - loan.paid_principal_amount);
        const interestRate = +loan.interest_rate;
        // const loan_period = +(12 * this.loan_period_year.value || 0) + this.loan_period_month.value || 0;
        const loan_period = +monthDiff;
        const interest_amount = +((loanAmount * interestRate * loan_period / 100)).toFixed(2);
        const principal_amount = +(amount - interest_amount).toFixed(2);
        const balance = +(loan.loan_amount - principal_amount).toFixed(2);

        // const transactionBlock: any = new TransactionBlock(
        //   uniqueTransactionID, customer_id, id, amount, balance, interest_amount, principal_amount, transaction_type,
        //   precedingHash,
        //   transactionNote
        // );
        // const createRecipientTransactionBlock = new TransactionModel(transactionBlock);
        // await createRecipientTransactionBlock.save();

        const updateLoadModel = {
          paid_principal_amount: loan.paid_principal_amount + principal_amount,
          paid_interest_amount: loan.paid_interest_amount + interest_amount,
          paid_till_month: currentMonth,
          paid_till_year: currentYear,
          loan_amount: loan.loan_amount - principal_amount,
        }
        await LoanModel.findOneAndUpdate({ _id: id }, updateLoadModel);

      } else if (transaction_type === TRANSACTION_TYPE.DEBIT) { // Dena
        if (loan.loan_amount > amount) {
          throw new UnauthorizedAccessErrorResult(APP_ENUM.TYPE.ERROR.CONFLICT, MESSAGE.INSUFFICIENT_BALANCE);
        }
      }
      response = { data: null, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name weeklyReport
   * @param {Object} params
   * @param {String} params.id
   */
  findWeeklyReport = async (params: any): Promise<IResponseType> => {
    try {
      let response: IResponseType;

      const currDate = new Date();
      const weekStart = new Date(currDate.getFullYear(), currDate.getMonth() - 1, currDate.getDate() - currDate.getDay() + 1);
      const weekEnd = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate() - currDate.getDay() + 7);

      const filterQuery = [
        {
          $match: {
            timestamp: { "$gte": weekStart, "$lt": weekEnd },
            transaction_type: APP_ENUM.TYPE.TRANSATION.CREDIT
          }
        },
        {
          $group: {
            _id: { $dayOfYear: '$timestamp' },
            creadit: {
              $sum: {
                $cond: {
                  if: { $eq: ["$transaction_type", APP_ENUM.TYPE.TRANSATION.CREDIT] },
                  then: "$amount",
                  else: 0
                }
              }
            },
            debit: {
              $sum: {
                $cond: {
                  if: { $eq: ["$transaction_type", APP_ENUM.TYPE.TRANSATION.DEBIT] },
                  then: "$amount",
                  else: 0
                }
              }
            },
            transactionType: { $first: "$transaction_type" },
            createdAt: { $first: "$timestamp" },
          }
        }
      ];
      const result = await TransactionModel.aggregate(filterQuery);
      response = { data: result, message: MESSAGE.GET };
      return response;
    } catch (error) {
      throw error;
    }
  }
}