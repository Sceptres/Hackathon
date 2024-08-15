from flask import Blueprint


core_blueprint = Blueprint('core',__name__)

from core import routes