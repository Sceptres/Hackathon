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
 * @param {string} userId The id of the user
 * @returns The active game of the user. Returns a empty object if there is no active game.
 */
export async function getUserActiveGame(userId) {
    const response = await fetch('http://127.0.0.1:8001/core/user/game/getActive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',             
        },
        body: JSON.stringify({
          "userId": userId
        }),
      });
      const data = await response.json();
      return data;
}

/**
 * 
 * @param {string} userId The id of the user that owns the portfolio 
 * @param {*} gameId The id of the game that owns this portfolio
 * @param {*} balance The initial and current balance of the portfolio
 * @returns The new portfolio object
 */
export async function createGamePortfolio(userId, gameId, balance) {
    const response = await fetch('http://127.0.0.1:8001/core/portfolio/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',             
        },
        body: JSON.stringify({
            userId: userId,
            gameId: gameId,
            balance: balance,
            initBalance: balance,
            stocks: {}
        }),
      });
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {string} userId The user id to create a game for
 * @param {*} startDate The start date of the game
 * @returns The created game
 */
export async function createUserGame(userId, startDate) {
    const response = await fetch('http://127.0.0.1:8001/core/game/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',             
        },
        body: JSON.stringify({
          "userId": userId,
          "status": "ACTIVE",
          "score": 0,
          "currentDate": startDate
        }),
      });
      const data = await response.json();

      await createGamePortfolio(userId, data.id, 50000);

      return data;
}

/**
 * 
 * @param {string} gameId The id of the game to update 
 * @param {string} userId The id of the owner of this game
 * @param {string} currentDate The date at which the user stopped in their game
 * @param {number} score The score of the game (set after the game is ended)
 * @param {string} status The status of the game. Is it (ACTIVE/COMPLETE)
 * @returns The updated game
 */
export async function updateGame(gameId, userId, currentDate, score, status) {
    const response = await fetch('http://127.0.0.1:8001/core/game/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',             
        },
        body: JSON.stringify({
            id: gameId,
            userId: userId,
            status: status,
            score: score,
            currentDate: currentDate
        }),
      });
      const data = await response.json();
      return data;
}