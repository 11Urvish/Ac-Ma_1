/** Live Api Endpoint of Fake Api Endpoint */
// export const LIVE_API_URL = 'http://13.127.190.65/api/';
export const LIVE_API_URL = 'http://localhost:5551/api/market/';
export const LIVE_API_ENDPOINT = {
  SERIES: 'getSeriesList?sport_id=',
  MATCH: 'getMatchesList?series_id=',
  MARKET: 'getMarketList?match_id=',
  ODDS: 'getOddsList?marketid=',
  FANCY: 'getFancyData?id='
}

export const MESSAGE = {
  DUPLICATE: '{0} already exists',
  LOGIN: 'Login Successful',
  GET: 'Get record successfully!.',
  GET_ALL: 'Get all records successfully!',
  CREATE: 'Record Created Successfully',
  UPDATE: 'Record updated successfully.',
  DELETE: 'Record deleted successfully.',
  GET_ERROR: 'Error: something went wrong',
  DUPLICATE_USERNAME: 'Username already exists.',
  DUPLICATE_PHONE: 'Phone number already exists.',
  INVALID_RECORD: 'Invalid record.',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  SIGN_UP: 'User Register successfully!',
  SIGN_IN: 'User Login successfully.',
  INVALID_CREDENTIAL: 'Invalid Email / Password.',
  INVALID_PASSWORD: 'You entered invalid current password, please try again.',
  ACCOUNT_BLOCKED: 'Your account is blocked, please contact to Admin.',
  ACCOUNT_IN_ACTIVE: 'Your account is not active, please contact to Admin.',
  ERROR: 'Error',
  UPLOAD_IMAGE: 'Upload image successfully.',
  PASSWORD_CHANGE: 'Congrats! Password has been change successfully.',
  PASSWORD_RESET: 'Congrats! Password has been reset successfully.',
  ONLINE: 'online',
  LOGOUT: 'logged out successfully.',
  DUPLICATE_RECORD: 'This record already available, please try with different',
  FANCY_NOT_DELETE: 'Bets are created with this fancy so can\'t delete that record.',
  RECEIVED_AMOUNT: '{recipient} Received from {sender}',
  TRANSFERED_AMOUNT: '{sender} Transfered to {recipient}',
  FANCY_RESULT_DECLARED: 'Fancy Result is declared Successfully!.',
  NOT_FOUND: 'Not Found',
  RELEASED_LOAN_PAYMENT: '#{loan_number}: Released Loan Payment.',
  INVALID_AMOUNT: 'Invalid amount.',
  LOAN_NOT_ACTIVE: 'Loan is not active.',
  LOAN_PAID_TILL_DATE: 'Loan is paid till date.',
  LOAN_PAID_TILL: 'Loan is paid till {date}.',
  PAYMENT_DATE_SHOULD_BE_GREATER_THAN_LAST_PAID_DATE: 'Payment date should be greater than Last paid date',
  PAYMENT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_LOAN_AMOUNT: 'Payment should be less than or equal to Loan amount',
  PAYMENT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_INTEREST_AMOUNT: 'Payment should be less than or equal to Interest amount',
  PART_PAYMENT: 'Part Payment for {0}',
  FULL_PAYMENT: 'Full Payment for {0}',
  WITHDRAW_AMOUNT: 'Withdraw Amount for {0}',
  DEPENDENCY: '{0} dependency'
}


