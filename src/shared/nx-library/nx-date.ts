class NxDate {

  getDateDiff(date_1: Date, date_2: Date): { year: number, month: number, day: number } {
    //convert to UTC
    var date2_UTC = new Date(Date.UTC(date_2.getUTCFullYear(), date_2.getUTCMonth(), date_2.getUTCDate()));
    var date1_UTC = new Date(Date.UTC(date_1.getUTCFullYear(), date_1.getUTCMonth(), date_1.getUTCDate()));
    // var yAppendix, mAppendix, dAppendix;
    //--------------------------------------------------------------
    let day = date2_UTC.getDate() - date1_UTC.getDate();
    if (day < 0) {

      date2_UTC.setMonth(date2_UTC.getMonth() - 1);
      day += this.getDaysInMonth(date2_UTC);
    }
    //--------------------------------------------------------------
    let month = date2_UTC.getMonth() - date1_UTC.getMonth();
    if (month < 0) {
      date2_UTC.setFullYear(date2_UTC.getFullYear() - 1);
      month += 12;
    }
    //--------------------------------------------------------------
    const year = date2_UTC.getFullYear() - date1_UTC.getFullYear();
    return { year, month, day };
  }

  getDaysInMonth(date2_UTC: Date) {
    var monthStart: any = new Date(date2_UTC.getFullYear(), date2_UTC.getMonth(), 1);
    var monthEnd: any = new Date(date2_UTC.getFullYear(), date2_UTC.getMonth() + 1, 1);
    var monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
    return monthLength;
  }

}
export default new NxDate();