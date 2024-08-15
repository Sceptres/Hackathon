import requests
from backend.core.external_api.clients.api_client import APICLIENT

class NewsAPIClient(APICLIENT):
    def __init__(self):
        super.__init__()
