from core import db_connection, transactions_blueprint
from flask import jsonify, request
from help import get_stock_price
from db import Portfolio

@transactions_blueprint.route('/buy', methods=['POST'])
async def buy_stock():
    try:
        request_data = request.get_json()
        ticker = request_data["ticker"]
        quantity = int(request_data["quantity"])
        date = request_data["date"]
        game_id = request_data["gameId"]

        price = await get_stock_price(date=date,ticker=ticker)

        total_price = price * quantity

        portfolio = db_connection.get_game_portfolio(game_id)
        balance = portfolio['balance']

        if total_price <= balance:
            if ticker in portfolio['stocks'].keys():
                portfolio['stocks'][ticker] += quantity
            else:
                portfolio['stocks'][ticker] = quantity
            portfolio['balance'] -= total_price

            portfolio_obj = Portfolio.from_dict(portfolio)
            response = jsonify(db_connection.update_portfolio(portfolio_id=portfolio['id'], portfolio=portfolio_obj))
            response.status_code = 200
        else:
            response = jsonify()
            response.status_code = 400
        return response
    
    except Exception as e:
        print("ERROR",str(e))
        response = jsonify(str(e))
        response.status_code = 500
        return response
    

@transactions_blueprint.route('/sell', methods=['POST'])
async def sell_stock():
    try:
        request_data = request.get_json()
        ticker = request_data["ticker"]
        quantity = int(request_data["quantity"])
        date = request_data["date"]
        game_id = request_data["gameId"]

        price = await get_stock_price(date=date,ticker=ticker)

        total_price = price * quantity

        portfolio = db_connection.get_game_portfolio(game_id)

        if ticker in portfolio['stocks'].keys() and portfolio['stocks'][ticker] >= quantity:
            portfolio['stocks'][ticker] -= quantity
            portfolio['balance'] += total_price

            portfolio_obj = Portfolio.from_dict(portfolio)
            response = jsonify(db_connection.update_portfolio(portfolio_id=portfolio['id'], portfolio=portfolio_obj))
            response.status_code = 200
        else:
            response = jsonify()
            response.status_code = 400
        return response
    
    except Exception as e:
        print("ERROR",str(e))
        response = jsonify(str(e))
        response.status_code = 500
        return response