from flask import Blueprint
from db import DBConnection


core_blueprint = Blueprint('core',__name__)
external_api_blueprint = Blueprint('external_api',__name__)

db_connection = DBConnection()

from core.routes import routes
from core.routes import external_api_routes