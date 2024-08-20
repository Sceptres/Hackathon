from firebase_admin import credentials, initialize_app, firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from auth import get_user_data
from enum import Enum
import datetime
import os

class User:
    def __init__(self, user_id: str, highscore: float) -> None:
        self.user_id = user_id
        self.highscore = highscore

    @staticmethod
    def from_dict(dict: dict):
        user_id = dict['id']
        highscore = dict['highscore']
        return User(
            user_id = user_id,
            highscore = highscore
        )
    
    def to_dict(self):
        return {
            'highscore': self.highscore
        }
    
class GameStatus(Enum):
    ACTIVE = 'ACTIVE',
    COMPLETE = 'COMPLETE'

    @staticmethod
    def from_value(value):
        if value == 'ACTIVE':
            return GameStatus.ACTIVE
        elif value == 'COMPLETE':
            return GameStatus.COMPLETE
        else:
            raise Exception('Game status can only be ACTIVE or COMPLETE') 
    
class Game:
    def __init__(self, user_id: str, score: float, current_date: datetime.datetime, status: GameStatus) -> None:
        self.user_id = user_id
        self.score = score
        self.current_date = current_date
        self.status = status

    @staticmethod
    def from_dict(dict: dict):
        user_id = dict['userId']
        score = dict['score']
        current_date = dict['currentDate']
        status = dict['status']
        return Game(
            user_id = user_id,
            score = score,
            current_date = current_date, 
            status = status
        )
    
    def to_dict(self):
        return {
            'userId': self.user_id,
            'score': self.score,
            'currentDate': self.current_date,
            'status': self.status
        }

# Class that represents a portfolio document
class Portfolio:
    def __init__(
            self, 
            user_id: str, 
            game_id: str,
            balance: float,
            init_balance: float,
            stocks: dict
    ) -> None:
        self.user_id = user_id
        self.game_id = game_id
        self.balance = balance
        self.init_balance = init_balance
        self.stocks = stocks

    @staticmethod
    def from_dict(dict: dict):
        user_id = dict['userId']
        game_id = dict['gameId']
        balance = dict['balance']
        init_balance = dict['initBalance']
        stocks = dict['stocks']
        return Portfolio(
            user_id = user_id,
            game_id = game_id,
            balance = balance,
            init_balance = init_balance,
            stocks = stocks
        )
    
    def to_dict(self):
        return {
            'userId': self.user_id,
            'gameId': self.game_id,
            'balance': self.balance,
            'initBalance': self.init_balance,
            'stocks': self.stocks
        }
    
# Class to connect to and communicate with Firestore db
class DBConnection:
    def __init__(self) -> None:
        self._cred = credentials.Certificate(f"{os.getcwd()}/backend/key.json")
        initialize_app(self._cred)
        self._db = firestore.client()
        self.user_collection_name = 'user'
        self.game_collection_name = 'game'
        self.portfolio_collection_name = 'portfolio'

    def insert_user(self, user: User):
        data = user.to_dict()

        doc_ref = self._db.collection(self.user_collection_name).document(user.user_id)
        doc_ref.set(data)
        data['id'] = doc_ref.id
        return data

    def insert_game(self, game: Game):
        data = game.to_dict()

        doc_ref = self._db.collection(self.game_collection_name).document()
        doc_ref.set(data)
        data['id'] = doc_ref.id
        return data

    def insert_portfolio(self, portfolio: Portfolio):
        data = portfolio.to_dict()

        doc_ref = self._db.collection(self.portfolio_collection_name).document()
        doc_ref.set(data)
        data['id'] = doc_ref.id
        return data
    
    def update_user(self, user: User):
        data = user.to_dict()

        collection_ref = self._db.collection(self.user_collection_name)
        doc_ref = collection_ref.document(user.user_id)
        doc_ref.update(data)
        data['id'] = doc_ref.id
        return data
    
    def update_game(self, game_id: str, game: Game):
        data = game.to_dict()

        collection_ref = self._db.collection(self.game_collection_name)
        doc_ref = collection_ref.document(game_id)
        doc_ref.update(data)
        data['id'] = doc_ref.id
        return data
    
    def update_portfolio(self, portfolio_id: str, portfolio: Portfolio):
        data = portfolio.to_dict()

        collection_ref = self._db.collection(self.portfolio_collection_name)
        doc_ref = collection_ref.document(portfolio_id)
        doc_ref.update(data)
        data['id'] = doc_ref.id
        return data
    
    def get_user(self, user_id: str):
        doc_ref = self._db.collection(self.user_collection_name).document(user_id)
        user = doc_ref.get()
        if(user.exists):
            user_data = user.to_dict()
            user_data['id'] = doc_ref.id
            return user_data
        else:
            return {}
    
    def get_user_leaderboard(self):
        collection_ref = self._db.collection(self.user_collection_name)
        query = collection_ref.order_by('highscore', direction=firestore.Query.DESCENDING).limit(10)
        query_stream = query.get()

        leaderboard = []
        for doc in query_stream:
            doc_dict = doc.to_dict()
            doc_dict['id'] = doc.id

            user = get_user_data(doc_dict['id'])
            doc_dict['displayName'] = user.display_name if hasattr(user, 'display_name') and user.display_name else user.email
            leaderboard.append(doc_dict)

        return leaderboard
    
    def get_game(self, game_id: str):
        doc_ref = self._db.collection(self.game_collection_name).document(game_id)
        game = doc_ref.get()
        if(game.exists):
            game_data = game.to_dict()
            game_data['id'] = doc_ref.id
            return game_data
        else:
            return {}

    def get_user_active_game(self, user_id: str):
        doc_ref = self._db.collection(self.game_collection_name)
        query = doc_ref.where(filter=FieldFilter('userId', '==', user_id)).where(filter=FieldFilter('status', '==', 'ACTIVE'))
        games = query.get()
        
        if len(games) != 0:
            doc = games[0]
            game = doc.to_dict()
            game['id'] = doc.id
        else:
            game = {}


        return game
    
    def get_game_portfolio(self, game_id: str):
        doc_ref = self._db.collection(self.portfolio_collection_name)
        query = doc_ref.where(filter = FieldFilter('gameId', '==', game_id))
        query_results = query.get()

        if len(query_results) != 0:
            portfolio_doc = query_results[0]
            portfolio = portfolio_doc.to_dict()
            portfolio['id'] = portfolio_doc.id
        else:
            portfolio = {}
        return portfolio