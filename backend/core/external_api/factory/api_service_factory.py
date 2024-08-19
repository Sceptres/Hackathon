from ..api_types import ApiTypes
from ..services.stock_service import StockApiService
from ..services.news_service import NewsApiService

class APIServiceFactory:
    @staticmethod
    def create_api_client(api_type:ApiTypes):
        if api_type == ApiTypes.Stock:
            return StockApiService()
        elif api_type == ApiTypes.News:
            return NewsApiService()
        else:
            raise Exception("Wrong Api Type ")