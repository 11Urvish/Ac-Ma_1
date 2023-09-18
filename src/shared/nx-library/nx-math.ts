class NxMath {

  /**
   * Calculate interest amount based on given amount and interest rate and period.
   */
  calculateInterestAmount = (amount: number, interestRate: number, period: number): number => {
    return amount * (interestRate / 100) * period;
  }


}
export default new NxMath();