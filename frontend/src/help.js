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

/*********************DATABASE BACKEND CALLS*********************/
/**
 * 
 * @param {string} gameId The id of the game to get the portfolio of
 * @returns The portfolio of the game given the id
 */
export async function getGamePortfilio(gameId) {
    const response = await fetch('http://127.0.0.1:8001/core/game/portfolio/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            gameId: gameId
        })
    });
    const portfolio = await response.json();
    return portfolio;
}

/**
 * 
 * @param {string} ticker The ticker of the stock being bought
 * @param {number} quantity The amount of the given stock to be bought
 * @param {string} date The date on which the stock is being bought
 * @param {string} gameId The id of the game where the buy transaction is happening
 * @returns The updated portfolio of the given game after the buy transaction
 */
export async function buyStock(ticker, quantity, date, gameId) {
    const response = await fetch('http://127.0.0.1:8001/transaction/buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ticker: ticker,
            quantity: quantity,
            date: date,
            gameId: gameId
        })
    });
    const updatedPortfolio = await response.json();
    return updatedPortfolio;
}

/**
 * 
 * @param {string} ticker The ticker of the stock being sold
 * @param {number} quantity The amount of the given stock to be sold
 * @param {string} date The date on which the stock is being sold
 * @param {string} gameId The id of the game where the sell transaction is happening
 * @returns The updated portfolio of the given game after the sell transaction
 */
export async function sellStock(ticker, quantity, date, gameId) {
    const response = await fetch('http://127.0.0.1:8001/transaction/sell', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ticker: ticker,
            quantity: quantity,
            date: date,
            gameId: gameId
        })
    });
    const updatedPortfolio = await response.json();
    return updatedPortfolio;
}