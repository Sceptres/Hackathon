from core import external_api_blueprint
from flask import jsonify, request, Response
from datetime import datetime
import datetime as dt

from ..external_api.factory.api_service_factory import APIServiceFactory

from ..external_api.api_types import ApiTypes 

@external_api_blueprint.route('/get_stock_by_date', methods=['POST'])
async def get_stock_by_date() -> Response:
    """
    POST /get_stock_by_date
    Description: Retrieves historical stock data for a specific ticker between 
                 the provided start and end dates. The end date is adjusted 
                 by adding one day to include the full range.
    Request Data: A JSON object containing:
                  - 'start_date' (str): The start date in 'YYYY-MM-DD' format.
                  - 'end_date' (str): The end date in 'YYYY-MM-DD' format.
                  - 'ticker' (str): The stock ticker symbol.
    Response:
        Success: Returns the stock data as a JSON object with status code 200.
        Failure: Returns a JSON object with the error message and status code 500.
    """

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
async def get_stock_ticker() -> Response:
    """
    POST /get_stock_ticker
    Description: Searches for stock tickers that match a given keyword.
    Request Data: A JSON object containing:
                  - 'keyword' (str): The keyword to search for.
    Response:
        Success: Returns a list of matching stock tickers as a JSON object with status code 200.
        Failure: Returns a JSON object with the error message and status code 500.
    """

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


    