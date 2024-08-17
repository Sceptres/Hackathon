from flask import Flask
from core import core_blueprint
import os
from flask_cors import CORS 



if __name__ == '__main__':
    app = Flask(__name__)
    CORS(app) 


    #Registering routes
    app.register_blueprint(core_blueprint,url_prefix="/core")

    app.run(host='0.0.0.0',port=8001,debug=True)