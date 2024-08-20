from datetime import datetime
import datetime as dt

from core.external_api.factory.api_service_factory import APIServiceFactory
from core.external_api.api_types import ApiTypes

async def get_stock_price(ticker, date) -> float:
    """
    Retrieves the stock price for a given ticker on a specified date.

    Parameters
    ----------
    ticker: str 
        The stock ticker symbol (e.g., AAPL).
    date: str
        The date for which the stock price is to be retrieved in 'YYYY-MM-DD' format.

    Returns
    -------
    float
        The stock price on the specified date.
    """

    date_obj = datetime.strptime(date, '%Y-%m-%d')
    date_obj += dt.timedelta(days=1)
    new_date = date_obj.strftime("%Y-%m-%d")

    stock_api = APIServiceFactory.create_api_client(ApiTypes.Stock)
    data = await stock_api.get_stock_by_date(date,new_date,ticker)

    return data[0]["price"]

async def calculate_portfolio_networth(current_game_date, balance: float, stocks: dict) -> float:
    """
    Calculates the net worth of a portfolio as of the current game date.

    Parameters
    ----------
    current_game_date: str
        The date for which the net worth is to be calculated in 'YYYY-MM-DD' format.
    balance: float 
        The current cash balance of the portfolio.
    stocks: dict
        A dictionary where keys are stock ticker symbols and values are the quantities of each stock.

    Returns
    -------
    float
        The total net worth of the portfolio, including the value of the stocks and the cash balance.
    """

    net_worth = balance

    for stock_ticker, stock_count in stocks.items():
        stock_price = await get_stock_price(ticker=stock_ticker, date=current_game_date)
        net_worth += stock_count * stock_price

    return net_worth