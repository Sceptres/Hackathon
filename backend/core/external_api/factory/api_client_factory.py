from core.external_api.client_types import ClientTypes
from core.external_api.clients.stock_api_client import StockAPIClient
from core.external_api.clients.news_api_client import NewsAPIClient

class APIClientFactory:
    @staticmethod
    def create_api_client(api_type:ClientTypes):
        if api_type == ClientTypes.Stock:
            return StockAPIClient()
        elif api_type == ClientTypes.News:
            return NewsAPIClient()
        else:
            raise Exception(" Wrong Client Type ")