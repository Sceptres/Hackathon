import configparser
import os
class StockService:
    def __init__(self):
        config = configparser.ConfigParser()
        config.read('config.ini')
        env = os.getenv('FLASK_DEBUG','develop')
        self.api_key = config[env]['API_KEY']