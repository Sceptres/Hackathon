from core import db_connection, transactions_blueprint
from flask import jsonify, request
from help import get_stock_price
from db import Portfolio

# Route for buying a certain stock at a certain date and quantity 
@transactions_blueprint.route('/buy', methods=['POST'])
async def buy_stock():
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
    
# Route for selling a certain stock at a certain date and quantity
@transactions_blueprint.route('/sell', methods=['POST'])
async def sell_stock():
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