from core import core_blueprint, db_connection
from db import Portfolio, Transaction, User, Game, TransactionStatus
from flask import jsonify, request
from datetime import datetime
from werkzeug import Response

@core_blueprint.route('/')
def index():
    return "Server is Alive"

####################################################################
#######################DATABASE API ENDPOINTS#######################
####################################################################

@core_blueprint.route('/user/insert', methods=['POST'])
def insert_user():
    try:
        request_data = request.get_json()
        user: User = User.from_dict(request_data)
        created_user = db_connection.insert_user(user)

        response = jsonify(created_user)
        response.status_code = 200

        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
@core_blueprint.route('/game/insert', methods=['POST'])
def insert_game():
    try:
        request_data = request.get_json()
        game: Game = Game.from_dict(request_data)
        created_game = db_connection.insert_game(game)

        response = jsonify(created_game)
        response.status_code = 200

        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response

@core_blueprint.route('/portfolio/insert', methods=['POST'])
def insert_portfolio():
    try:
        request_data = request.get_json()
        portfolio: Portfolio = Portfolio.from_dict(request_data)
        created_portfolio = db_connection.insert_portfolio(portfolio)
        
        response = jsonify(created_portfolio)
        response.status_code = 200

        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
@core_blueprint.route('/transaction/insert', methods=['POST'])
def insert_transaction():
    try:
        request_data = request.get_json()
        transaction: Transaction = Transaction.from_dict(request_data)
        created_transaction = db_connection.insert_transaction(transaction)

        response = jsonify(created_transaction)
        response.status_code = 200
        
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
@core_blueprint.route('user/update', methods=['POST'])
def update_user():
    try:
        request_data = request.get_json()
        user: User = User.from_dict(request_data)
        updated_user = db_connection.update_user(user)

        response = jsonify(updated_user)
        response.status_code = 200

        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
@core_blueprint.route('game/update', methods=['POST'])
def update_game():
    try:
        request_data = request.get_json()
        game_id = request_data['id']
        game: Game = Game.from_dict(request_data)  
        updated_game = db_connection.update_game(game_id, game)

        response = jsonify(updated_game)
        response.status_code = 200

        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
        
@core_blueprint.route('/portfolio/update', methods=['POST'])
def update_portfolio():
    try:
        request_data = request.get_json()
        portfolio_id = request_data['id']
        portfolio: Portfolio = Portfolio.from_dict(request_data)
        updated_portfolio = db_connection.update_portfolio(portfolio_id, portfolio)

        response = jsonify(updated_portfolio)
        response.status_code = 200

        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
@core_blueprint.route('/transaction/update', methods=['POST'])
def update_transaction():
    try:
        request_data = request.get_json()
        transaction_id = request_data['id']
        transaction: Transaction = Transaction.from_dict(request_data)
        updated_transaction = db_connection.update_transaction(transaction_id, transaction)

        response = jsonify(updated_transaction)
        response.status_code = 200

        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
# Only API endpoint that accepts a GET request
@core_blueprint.route('/leaderboard/get')
def get_leaderboard():
    try:
        leaderboard = db_connection.get_user_leaderboard()

        response = jsonify(leaderboard)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
@core_blueprint.route('/user/get', methods=['POST'])
def get_user():
    try:
        request_data = request.get_json()
        user_id: str = request_data['id']
        user = db_connection.get_user(user_id)

        response = jsonify(user)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
@core_blueprint.route('/user/game/get', methods=['POST'])
def get_user_games():
    try:
        request_data = request.get_json()
        user_id = request_data['userId']
        games = db_connection.get_user_games(user_id)

        response = jsonify(games)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
@core_blueprint.route('/game/portfolio/get', methods=['POST'])
def get_game_portfolio():
    try:
        request_data = request.get_json()
        game_id = request_data['gameId']
        portfolio = db_connection.get_game_portfolio(game_id)

        response = jsonify(portfolio)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
@core_blueprint.route('/user/portfolio/get', methods=['POST'])
def get_user_portfolios():
    try:
        request_data = request.get_json()
        user_id = request_data['userId']
        portfolios = db_connection.get_user_portfolios(user_id)

        response = jsonify(portfolios)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
@core_blueprint.route('/game/transaction/get', methods=['POST'])
def get_game_transactions():
    try:
        request_data = request.get_json()
        game_id = request_data['gameId']
        transactions = db_connection.get_game_transactions(game_id)

        response = jsonify(transactions)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response

@core_blueprint.route('/user/transaction/get', methods=['POST'])
def get_user_transactions():
    try:
        request_data = request.get_json()
        user_id = request_data['userId']
        portfolio = db_connection.get_user_transactions(user_id)

        response = jsonify(portfolio)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
@core_blueprint.route('/portfolio/transaction/get', methods=['POST'])
def get_portfolio_transactions():
    try:
        request_data = request.get_json()
        portfolio_id = request_data['portfolioId']
        portfolio = db_connection.get_portfolio_transactions(portfolio_id)

        response = jsonify(portfolio)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
