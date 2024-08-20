from core import core_blueprint, db_connection
from db import Portfolio, User, Game, GameStatus
from flask import jsonify, request
from help import calculate_portfolio_networth

@core_blueprint.route('/')
def index():
    return "Server is Alive"

####################################################################
#######################GAME LOGIC API ENDPOINTS#####################
####################################################################
@core_blueprint.route('/game/end', methods=['POST'])
async def end_game() -> Response:
    """
    POST /game/end
    Description: Ends an ongoing game, calculates the final score, updates 
                 the game and user data, and checks if the user achieved a 
                 new high score.
    Request Data: A JSON object containing the 'gameId' (str) of the game 
                  to be ended.
    Response:
        Success: Returns a JSON object containing the updated portfolio data, 
                 the game score, and a flag indicating if a new high score was 
                 achieved. Status code 200.
        Failure: Returns a JSON object with the error message and status code 500.
    """

    try:
        request_data = request.get_json()
        game_id = request_data['gameId']

        game = db_connection.get_game(game_id=game_id)
        user = db_connection.get_user(user_id=game['userId'])
        portfolio = db_connection.get_game_portfolio(game['id'])

        # Update game
        game['status'] = GameStatus.COMPLETE.name        
        game_score = await calculate_portfolio_networth(game['currentDate'], portfolio['balance'], portfolio['stocks'])
        game['score'] = game_score

        # Did the user reach a new highscore?
        if game['score'] > user['highscore']:
            user['highscore'] = game['score']
            portfolio['achievedNewHighScore'] = True
        else:
            portfolio['achievedNewHighScore'] = False

        db_connection.update_game(game['id'], Game.from_dict(game))
        db_connection.update_user(User.from_dict(user))

        portfolio['score'] = game['score']

        response = jsonify(portfolio)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response


####################################################################
#######################DATABASE API ENDPOINTS#######################
####################################################################

@core_blueprint.route('/user/insert', methods=['POST'])
def insert_user() -> Response:
    """
    POST /user/insert
    Description: Inserts a new user into the database.
    Request Data: A JSON object representing the user data.
    Response:
        Success: Returns the created user as a JSON object with status code 200.
        Failure: Returns a JSON object with the error message and status code 500.
    """

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
def insert_game() -> Response:
    """
    POST /game/insert
    Description: Inserts a new game into the database.
    Request Data: A JSON object representing the game data.
    Response:
        Success: Returns the created game as a JSON object with status code 200.
        Failure: Returns a JSON object with the error message and status code 500.
    """

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
def insert_portfolio() -> Response:
    """
    POST /portfolio/insert
    Description: Inserts a new portfolio into the database.
    Request Data: A JSON object representing the portfolio data.
    Response:
        Success: Returns the created portfolio as a JSON object with status code 200.
        Failure: Returns a JSON object with the error message and status code 500.
    """

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
    
@core_blueprint.route('/game/update', methods=['POST'])
def update_game() -> Response:
    """
    POST /game/update
    Description: Updates an existing game in the database.
    Request Data: A JSON object representing the updated game data. Must include the 'id' field.
    Response:
        Success: Returns the updated game as a JSON object with status code 200.
        Failure: Returns a JSON object with the error message and status code 500.
    """

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
    
# Only API endpoint that accepts a GET request
@core_blueprint.route('/leaderboard/get')
def get_leaderboard() -> Response:
    """
    GET /leaderboard/get
    Description: Retrieves the user leaderboard from the database.
    Request Data: None (GET request).
    Response:
        Success: Returns the leaderboard as a JSON object with status code 200.
        Failure: Returns a JSON object with the error message and status code 500.
    """

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
def get_user() -> Response:
    """
    POST /user/get
    Description: Retrieves a user by ID from the database.
    Request Data: A JSON object containing the 'id' field (user ID).
    Response:
        Success: Returns the user as a JSON object with status code 200.
        Failure: Returns a JSON object with the error message and status code 500.
    """

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

@core_blueprint.route('/user/game/getActive', methods=['POST'])
def get_user_active_game() -> Response:
    """
    POST /user/game/getActive
    Description: Retrieves the active game(s) for a specific user.
    Request Data: A JSON object containing the 'userId' field.
    Response:
        Success: Returns a JSON object with the active game(s) and status code 200.
        Failure: Returns a JSON object with the error message and status code 500.
    """

    try:
        request_data = request.get_json()
        user_id = request_data['userId']
        games = db_connection.get_user_active_game(user_id)

        response = jsonify(games)
        response.status_code = 200
        return response
    except Exception as e:
        response = jsonify(str(e))
        response.status_code = 500
        return response        
    
@core_blueprint.route('/game/portfolio/get', methods=['POST'])
def get_game_portfolio() -> Response:
    """
    POST /game/portfolio/get
    Description: Retrieves the portfolio associated with a specific game.
    Request Data: A JSON object containing the 'gameId' field.
    Response:
        Success: Returns the portfolio as a JSON object with status code 200.
        Failure: Returns a JSON object with the error message and status code 500.
    """

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