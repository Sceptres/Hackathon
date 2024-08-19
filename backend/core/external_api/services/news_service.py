import aiohttp
from .api_service import ApiService

class NewsApiService(ApiService):
    def __init__(self):
        super().__init__()


    async def get_stock_news(self, ticker):
        url = f'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={ticker}&apikey={self.api_key}'

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