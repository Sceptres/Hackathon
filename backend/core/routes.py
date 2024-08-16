from core import core_blueprint, db_connection
from db import Portfolio, Transaction, TransactionStatus
from flask import jsonify, request
from datetime import datetime
from werkzeug import Response

@core_blueprint.route('/')
def index():
    return "Server is Alive"

####################################################################
#######################DATABASE API ENDPOINTS#######################
####################################################################

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
    
@core_blueprint.route('/portfolio/user/get', methods=['POST'])
def get_user_portfolio():
    try:
        request_data = request.get_json()
        user_id = request_data['userId']
        portfolio = db_connection.get_user_portfolio(user_id)

        response = jsonify(portfolio)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response
    
@core_blueprint.route('/transaction/user/get', methods=['POST'])
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
    
@core_blueprint.route('/transaction/portfolio/get', methods=['POST'])
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