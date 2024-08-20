from datetime import datetime
import datetime as dt

from core.external_api.factory.api_service_factory import APIServiceFactory
from core.external_api.api_types import ApiTypes

async def get_stock_price(ticker,date):
    date_obj = datetime.strptime(date, '%Y-%m-%d')
    date_obj += dt.timedelta(days=1)
    new_date = date_obj.strftime("%Y-%m-%d")

    stock_api = APIServiceFactory.create_api_client(ApiTypes.Stock)
    data = await stock_api.get_stock_by_date(date,new_date,ticker)

    return data[0]["price"]

async def calculate_portfolio_networth(current_game_date, balance: float, stocks: dict):
    net_worth = balance

    for stock_ticker, stock_count in stocks.items():
        stock_price = await get_stock_price(ticker=stock_ticker, date=current_game_date)
        net_worth += stock_count * stock_price

    return net_worth