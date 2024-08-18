from abc import ABC,abstractmethod
import configparser
import os
class ApiService(ABC):
    def __init__(self) -> None:
        super().__init__()
        config = configparser.ConfigParser()
        config_file_path = 'config.ini'
        
        config.read(config_file_path)
        print("error")
        print(config.sections())
        env = os.getenv('FLASK_DEBUG','develop')
        self.api_key = "XGSXOW4UPLENOG28"#config[env]['API_KEY']
        
   