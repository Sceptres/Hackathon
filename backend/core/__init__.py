from flask import Blueprint
from db import DBConnection


core_blueprint = Blueprint('core',__name__)
db_connection = DBConnection()

from core import routes