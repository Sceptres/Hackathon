import aiohttp
import yfinance as yf

from .api_service import ApiService

class StockApiService(ApiService):
    def __init__(self):
        super().__init__()
        
    async def search_tickers(self, keyword):
        url = f'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={keyword}&apikey={self.api_key}'

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data
                    else:
                        print(f"Error: Received status code {response.status}")
                        return None
        except Exception as e:
            print(f"An error occurred: {e}")
            return None
        
    async def get_stock_by_date(self, start_date,end_date,ticker):

        try:
            stock = yf.Ticker(ticker)
            
            historical_data = stock.history(start=start_date, end=end_date, interval="1d")
            
            return historical_data
        except Exception as e:
            print(f"An error occurred: {e}")
            return None
