from abc import ABC,abstractmethod
import configparser
import os
class APICLIENT(ABC):
    def __init__(self) -> None:
        super().__init__()
        config = configparser.ConfigParser()
        config.read('config.ini')
        env = os.getenv('FLASK_DEBUG','develop')
        self.api_key = config[env]['API_KEY']
        
    @abstractmethod
    def fetch(self):
        pass
       