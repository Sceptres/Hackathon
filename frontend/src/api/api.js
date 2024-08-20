/************************DATABASE API CALLS************************/

import { apiUrl } from "../help/help";

/**
 * 
 * @param {string} userId The id of the user to get from the database
 * @returns The user object with the users id and highscore
 */
export async function getUser(userId) {
    const response = await fetch(apiUrl('/api/user/get'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',             
        },
        body: JSON.stringify({
          id: userId
      }),
    });
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {string} userId The id of the user to insert into the database 
 * @returns The user object that was inserted into the database
 */
export async function insertUser(userId) {
    const response = await fetch(apiUrl('/api/user/insert'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            highscore: 0,
            id: userId
        }),
    });
    const data = await response.json();
    return data;
}

/**
 * 
 * @returns A list representing the 10 users on the leaderboard
 */
export async function getLeaderboard() {
    const response = await fetch(apiUrl('/api/leaderboard/get'), {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',             
        },
    });
    const data = await response.json();
    return data;
}
  
/**
 * 
 * @param {string} gameId The id of the game to get the portfolio of
 * @returns The portfolio of the game given the id
 */
export async function getGamePortfilio(gameId) {
    const response = await fetch(apiUrl('/api/game/portfolio/get'), {
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
    const response = await fetch(apiUrl('/api/user/game/getActive'), {
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
    const response = await fetch(apiUrl('/api/portfolio/insert'), {
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
    const response = await fetch(apiUrl('/api/game/insert'), {
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
    const response = await fetch(apiUrl('/api/game/update'), {
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
  
/**
 * 
 * @param {string} gameId The id of the game to end
 * @returns The portfolio with the users stats for that game
 */
export async function endGame(gameId) {
    const response = await fetch(apiUrl('/api/game/end'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId: gameId
      }),
    });
    const portfolio = await response.json();
    return portfolio;
}

/************************EXTERNAL API CALLS************************/
/**
 * 
 * @param {string} search The search string to search for stock tickers
 * @returns List of possible stock tickers that match the given search string
 */
export async function getStockTicker(search) {
    const response = await fetch(apiUrl('/external_api/get_stock_ticker'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            keyword: search

        }),
    })
    const data = await response.json();
    return data;
}

/**
 * 
 * @param {string} ticker The stock ticker for which to get the stock data
 * @param {string} startDate The date from which we start gathering data (inclusive)
 * @param {string} endDate The date from which we end gathering data (inclusive)
 * @returns A list of objects containing the prices of the stock during each day in the given date range
 */
export async function getStockData(ticker, startDate, endDate) {
    const response = await fetch(apiUrl('/external_api/get_stock_by_date'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ticker: ticker,
            start_date: startDate,
            end_date: endDate
        }),
    });
    const data = await response.json();
    return data;
}