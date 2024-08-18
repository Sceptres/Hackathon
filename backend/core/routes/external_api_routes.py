from core import external_api_blueprint, db_connection
from db import Portfolio, Transaction, User, Game, TransactionStatus
from flask import jsonify, request
from datetime import datetime
from werkzeug import Response

from ..external_api.factory.api_service_factory import APIServiceFactory

from ..external_api.api_types import ApiTypes



@external_api_blueprint.route('/get_news', methods=['POST'])
async def get_news():
    try:
        request_data = request.get_json()
    
        news_api = APIServiceFactory.create_api_client(ApiTypes.News)
        data = await news_api.get_stock_news(request_data['ticker'])
        response = jsonify(data)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response

    


@external_api_blueprint.route('/get_stock_by_date', methods=['POST'])
async def get_stock_by_date():
    try:
        request_data = request.get_json()
        start_date = request_data['start_date']
        end_date = request_data['end_date']
        ticker = request_data['ticker']
    
        stock_api = APIServiceFactory.create_api_client(ApiTypes.Stock)
        data = await stock_api.get_stock_by_date(start_date,end_date,ticker)
        response = jsonify(data)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    


@external_api_blueprint.route('/get_stock_ticker', methods=['POST'])
async def get_stock_ticker():
    try:
        request_data = request.get_json()
        keyword = request_data["keyword"]
        stock_api = APIServiceFactory.create_api_client(ApiTypes.Stock)
        data = await stock_api.search_tickers(keyword)
        response = jsonify(data)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response


    