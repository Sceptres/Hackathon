from ..api_types import ApiTypes
from ..services.stock_service import StockApiService

class APIServiceFactory:
    @staticmethod
    def create_api_client(api_type:ApiTypes):
        if api_type == ApiTypes.Stock:
            return StockApiService()
        else:
            raise Exception("Wrong Api Type ")