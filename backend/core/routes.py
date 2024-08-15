from core import core_blueprint

@core_blueprint.route('/')
def index():
    return "Server is Alive"