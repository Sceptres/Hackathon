/**
 * A factory function to make new Portfolio documents for the firestore database
 * 
 * @param {string} userId A string representing the id of the user this portfolio belongs to 
 * @param {number} balance A decimal number representing the balance of the portfolio, i.e. how much cash the user has
 * @param {number} netProfit A decimal number representing the net profit made by the user owning this portfolio. totalProfit-totalLoss
 * @param {number} totalProfit A decimal number representing the total profit made by the user owning this portfolio
 * @param {number} totalLoss A decimal number representing the total loss made by the user owning this portfolio
 * @param {number} totalTrades An integer number representing the number of trades the user owning this portfolio has done
 * @returns An new Portfolio document to be stored in the firestore database
 */
export const PortfolioFactory = (userId, balance, netProfit, totalProfit, totalLoss, totalTrades) => {
    return {
        userId: userId,
        balance: balance,
        netProfit: netProfit,
        totalProfit: totalProfit,
        totalLoss: totalLoss,
        totalTrades: totalTrades
    };
};

/**
 * A factory function to make new Transaction documents for the firestore database
 * 
 * @param {string} userId A string representing the id of the user this transaction belongs to 
 * @param {string} portfolioId A string representing the id of the portfolio this transaction belongs to
 * @param {string} stockSymbol The symbol of the stock/cryptocurrency purchased in this transaction
 * @param {number} quantity A decimal number representing the amount of the stock/cryptocurrency that was purchased
 * @param {number} priceAtBuyTransaction A decimal number representing the price of the stock/cryptocurrency when purchased
 * @param {number} priceAtSellTransaction A decimal number representing the price of the stock/cryptocurrency when sold
 * @param {Timestamp} transactionOpenDate A timestamp showing when the transaction was opened
 * @param {Timestamp} transactionCloseDate A timestamp showing when the transaction was closed
 * @param {string} status The status of the transaction from the TransactionStatus object.
 * @returns A new Transaction document to be stored in the firestore database
 */
export const TransactionFactory = (
    userId, 
    portfolioId, 
    stockSymbol, 
    quantity, 
    priceAtBuyTransaction, 
    priceAtSellTransaction, 
    transactionOpenDate, 
    transactionCloseDate, 
    status
) => {
    return {
        userId: userId,
        portfolioId: portfolioId,
        stockSymbol: stockSymbol,
        quantity: quantity,
        priceAtBuyTransaction: priceAtBuyTransaction,
        priceAtSellTransaction: priceAtSellTransaction,
        transactionOpenDate: transactionOpenDate,
        transactionCloseDate: transactionCloseDate,
        status: status
    };
};

export const TransactionStatus = {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED'
};