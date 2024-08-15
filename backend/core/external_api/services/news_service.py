import requests
from backend.core.external_api.services.api_service import ApiService

class NewsApiService(ApiService):
    def __init__(self):
        super.__init__()
