import aiohttp
import yfinance as yf

from .api_service import ApiService

class StockApiService(ApiService):
    def __init__(self):
        super().__init__()
        
    async def search_tickers(self, keyword):
        url = f'https://ticker-2e1ica8b9.now.sh/keyword/{keyword}'
        
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
            #average price
            data = []
            for date, row in historical_data.iterrows():
                temp = {}
                price = round(( row[ 'High'] + row[ 'Low'] ) /2,2)
                temp['price'] = price
                temp["Date"]=  date.strftime('%Y-%m-%d')
                data.append(temp)
            return data
        except Exception as e:
            print(f"An error occurred: {e}")
            return None
