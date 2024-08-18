from core import external_api_blueprint, db_connection
from db import Portfolio, Transaction, User, Game, TransactionStatus
from flask import jsonify, request
from datetime import datetime
from werkzeug import Response

from ..external_api.factory.api_service_factory import APIServiceFactory

from ..external_api.api_types import ApiTypes



@external_api_blueprint.route('/get_news', methods=['POST'])
async def get_news():
    print("ini")
    try:
        request_data = request.get_json()
    
        stock_api = APIServiceFactory.create_api_client(ApiTypes.News)
        data = await stock_api.get_stock_news(request_data['ticker'])
        response = jsonify(data)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response

    