from core import external_api_blueprint
from flask import jsonify, request
from datetime import datetime
import datetime as dt

from ..external_api.factory.api_service_factory import APIServiceFactory

from ..external_api.api_types import ApiTypes 

@external_api_blueprint.route('/get_stock_by_date', methods=['POST'])
async def get_stock_by_date():
    try:
        request_data = request.get_json()
        start_date = request_data['start_date']
        end_date = request_data['end_date']
        ticker = request_data['ticker']

        date_obj = datetime.strptime(end_date, '%Y-%m-%d')
        date_obj += dt.timedelta(days=1)
        end_date = date_obj.strftime("%Y-%m-%d")
    
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


    