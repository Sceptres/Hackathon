from core import db_connection, transactions_blueprint
from flask import jsonify, request, Response
from help import get_stock_price
from db import Portfolio

@transactions_blueprint.route('/buy', methods=['POST'])
async def buy_stock() -> Response:
    """
    POST /buy
    Description: Handles the buying of a specified quantity of a stock at a given date for a specific game.
    Request Data: A JSON object containing:
                  - 'ticker' (str): The stock ticker symbol (e.g., AAPL).
                  - 'quantity' (int): The number of shares to buy.
                  - 'date' (str): The date on which the stock is bought in 'YYYY-MM-DD' format.
                  - 'gameId' (str): The ID of the game the transaction is tied to.
    Logic:
        1. Retrieves the stock price for the given ticker on the specified date.
        2. Calculates the total purchase price by multiplying the stock price by the quantity.
        3. Retrieves the player's portfolio associated with the specified game ID.
        4. Checks if the player has sufficient balance to make the purchase.
        5. If sufficient funds are available, updates the portfolio by adding the stock and deducting the total price from the balance.
        6. Constructs a new portfolio object and updates the database with the modified portfolio.
    Response:
        Success: Returns the updated portfolio as a JSON object with status code 200.
        Failure: Returns a 400 status code if insufficient funds are available, or a 500 status code if an error occurs.
    """

    try:
        # Get the request data
        request_data = request.get_json()
        ticker = request_data["ticker"]
        quantity = int(request_data["quantity"])
        date = request_data["date"]
        game_id = request_data["gameId"]

        # Use the stock ticker(eg. AAPL) and date to retrieve the avg stock price at that day
        price = await get_stock_price(date=date,ticker=ticker)

        # Get the total purchase price
        total_price = price * quantity

        # Get the player's portflio that's tied to the ongoing game
        portfolio = db_connection.get_game_portfolio(game_id)
        # Get the user's available cash/balance from the portfolio
        balance = portfolio['balance']

        # Check for sufficient funds
        if total_price <= balance:
            # Add stock quantity to portfolio, adding a new index if user didn't purchase that stock
            # from before
            if ticker in portfolio['stocks'].keys():
                portfolio['stocks'][ticker] += quantity
            else:
                portfolio['stocks'][ticker] = quantity
            # Withdraw from balance
            portfolio['balance'] -= total_price

            # Construct a new portfolio object from the portfolio dictionary
            portfolio_obj = Portfolio.from_dict(portfolio)
            # Update the user's ongoing game portfolio with the new portfolio object
            response = jsonify(db_connection.update_portfolio(portfolio_id=portfolio['id'], portfolio=portfolio_obj))
            response.status_code = 200
        # If non-sufficient funds, return error 400 bad request
        else:
            response = jsonify()
            response.status_code = 400
        return response
    # If any error occurs, catch it and return error 500 internal server error
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
@transactions_blueprint.route('/sell', methods=['POST'])
async def sell_stock() -> Response:
    """
    POST /sell
    Description: Handles the selling of a specified quantity of a stock at a given date for a specific game.
    Request Data: A JSON object containing:
                  - 'ticker' (str): The stock ticker symbol (e.g., AAPL).
                  - 'quantity' (int): The number of shares to sell.
                  - 'date' (str): The date on which the stock is sold in 'YYYY-MM-DD' format.
                  - 'gameId' (str): The ID of the game the transaction is tied to.
    Logic:
        1. Retrieves the stock price for the given ticker on the specified date.
        2. Calculates the total sale price by multiplying the stock price by the quantity.
        3. Retrieves the player's portfolio associated with the specified game ID.
        4. Checks if the player has the stock in their portfolio and sufficient quantity to sell.
        5. If sufficient shares are available, updates the portfolio by removing the stock and adding the total sale price to the balance.
        6. Constructs a new portfolio object and updates the database with the modified portfolio.
    Response:
        Success: Returns the updated portfolio as a JSON object with status code 200.
        Failure: Returns a 400 status code if insufficient shares are available, or a 500 status code if an error occurs.
    """

    try:
        # Refer to above route for similar documentation
        request_data = request.get_json()
        ticker = request_data["ticker"]
        quantity = int(request_data["quantity"])
        date = request_data["date"]
        game_id = request_data["gameId"]

        price = await get_stock_price(date=date,ticker=ticker)

        total_price = price * quantity

        portfolio = db_connection.get_game_portfolio(game_id)

        # Check if user's current game portfolio has the stock ticker as a key with sufficient quantity
        # (aka check if user has bought this stock from before and can sell the requested amount)
        if ticker in portfolio['stocks'].keys() and portfolio['stocks'][ticker] >= quantity:
            # Remove specified stock quantity from ueser's current game portfolio and increase
            # user's cash balance accordingly 
            portfolio['stocks'][ticker] -= quantity
            portfolio['balance'] += total_price

            # Construct a new portfolio object from the portfolio dictionary
            portfolio_obj = Portfolio.from_dict(portfolio)
            # Update the user's ongoing game portfolio with the new portfolio object
            response = jsonify(db_connection.update_portfolio(portfolio_id=portfolio['id'], portfolio=portfolio_obj))
            response.status_code = 200
        # If user didn't buy this stock/has insufficient shares, return 400 bad request
        else:
            response = jsonify()
            response.status_code = 400
        return response
    # If any error occurs, catch it and return error 500 internal server error
    except Exception as e:
        print("ERROR",str(e))
        response = jsonify(str(e))
        response.status_code = 500
        return response