import requests
from backend.core.external_api.services.api_service import ApiService

class StockApiService(ApiService):
    def __init__(self):
        super.__init__()
        