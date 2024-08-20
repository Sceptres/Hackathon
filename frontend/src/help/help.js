/**
 * 
 * @param {string} dateStr The date string to turn into a date object 
 * @returns A date object that does not run in the local timezone of the device, rather just takes the days
 */
export function getDate(dateStr) {
    const date = new Date(dateStr);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Account for timezone difference to only deal with days
    return date;
}

/**
 * 
 * @param {Date} date The date object to turn into a string 
 * @returns A string representing the given date in the format 'yyyy-mm-dd'
 */
export function dateToStringFormat(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * 
 * @param {number} money The amout to convert to USD format 
 * @returns A string representing the amount in the format $###,###,###.##
 */
export function formatNumberToUSD(money) {
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    return USDollar.format(money);
}