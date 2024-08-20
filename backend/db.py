from firebase_admin import credentials, initialize_app, firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from auth import get_user_data
from enum import Enum
import datetime
import os

# This class represents a user document in the Firestore database
class User:
    def __init__(self, user_id: str, highscore: float) -> None:
        """
        Parameters
        ----------
        user_id: str
            The id of the user from the firebase authentication system. Stored in the database to tie the user with their highscore.
        highscore: float
            The highest score achieved by the user amongst all their games.
        """

        self.user_id = user_id
        self.highscore = highscore

    @staticmethod
    def from_dict(dict: dict):
        """
        Parameters
        ----------
        dict: dict
            The dictionary to turn into a User object

        Returns
        -------
        User
            A user object
        """

        user_id = dict['id']
        highscore = dict['highscore']
        return User(
            user_id = user_id,
            highscore = highscore
        )
    
    def to_dict(self):
        """
        Parameters
        ----------
        ...

        Returns
        -------
        dict
            Returns a dictionary that represents this User object
        """

        return {
            'highscore': self.highscore
        }
    
# A class representing the status of a game
# ACTIVE means that the user is still playing this game
# COMPLETE means that the user has finished and ended this game
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
    
# This class represents a game game document in the Firestore database
class Game:
    def __init__(self, user_id: str, score: float, current_date: str, status: GameStatus) -> None:
        """
        Parameters
        ----------
        user_id: str
            The id of the user who owns this game
        score: float
            The score the user accumulated in this game. Meaning, what was his total net worth at the end of the game
        currentDate: str
            A string representing the current day in the game. This string has the format YYYY-MM-DD
        status: GameStatus
            The current status of the game. Is the game still ACTIVE or is the game COMPLETE
        """

        self.user_id = user_id
        self.score = score
        self.current_date = current_date
        self.status = status

    @staticmethod
    def from_dict(dict: dict):
        """
        Parameters
        ---------
        dict: dict
            A dictionary that has the data of the Game object. Follows the structure below.
            {
                userId: 'user id goes here',
                score: score goes here,
                currentDate: 'YYYY-MM-DD',
                status: 'ACTIVE or COMPLETE'
            }

            Returns
            -------
            Game
                Returns a Game object
        """

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
        """
        Parameters
        ----------
        ...

        Returns
        dict
            Returns a dictionary representing this Game object
        """

        return {
            'userId': self.user_id,
            'score': self.score,
            'currentDate': self.current_date,
            'status': self.status
        }

# This class represents a portfolio document in the Firebase database
class Portfolio:
    def __init__(
            self, 
            user_id: str, 
            game_id: str,
            balance: float,
            init_balance: float,
            stocks: dict
    ) -> None:
        """
        Parameters
        ----------
        user_id: str
            The id of the user that owns this portfolio
        game_id: str
            The id of the game that owns this portfolio
        balance: float
            The cash balance of this portfolio
        initBalance: float
            The initial cash balance of this portfolio
        stocs: dict
            A dictionary consisting of a stock ticker as a key and the number of stocks owned as the value
        """

        self.user_id = user_id
        self.game_id = game_id
        self.balance = balance
        self.init_balance = init_balance
        self.stocks = stocks

    @staticmethod
    def from_dict(dict: dict):
        """
        Parameters
        ----------
        dict: dict
            A dictionary that has the data of the Portfolio object. Follows the structure below.
            {
                userId: 'user id goes here',
                gameId: 'game id goes here',
                balance: balance goes here,
                initBalance: Initial balance goes here,
                stocks: {
                    ticker: number of stocks owned goes here
                }
            }

        Returns
        -------
        Portfolio
            Returns a Portfolio object
        """

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
        """
        Parameters
        ----------
        ...

        Returns
        -------
        dict
            Returns a dictionary representing this Game object
        """

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
        """
        Initializes the connection to Firestore and sets up the credentials and collection names.

        Parameters
        ----------
        None
        """

        self._cred = credentials.Certificate(f"{os.getcwd()}/backend/key.json")
        initialize_app(self._cred)
        self._db = firestore.client()
        self.user_collection_name = 'user'
        self.game_collection_name = 'game'
        self.portfolio_collection_name = 'portfolio'

    def insert_user(self, user: User):
        """
        Inserts a new user document into the Firestore database.

        Parameters
        ----------
        user: User
            A User object to be inserted into the Firestore database.

        Returns
        -------
        dict
            A dictionary representing the inserted user document, including the generated document ID.
        """

        data = user.to_dict()

        doc_ref = self._db.collection(self.user_collection_name).document(user.user_id)
        doc_ref.set(data)
        data['id'] = doc_ref.id
        return data

    def insert_game(self, game: Game):
        """
        Inserts a new game document into the Firestore database.

        Parameters
        ----------
        game: Game
            A Game object to be inserted into the Firestore database.

        Returns
        -------
        dict
            A dictionary representing the inserted game document, including the generated document ID.
        """

        data = game.to_dict()

        doc_ref = self._db.collection(self.game_collection_name).document()
        doc_ref.set(data)
        data['id'] = doc_ref.id
        return data

    def insert_portfolio(self, portfolio: Portfolio):
        """
        Inserts a new portfolio document into the Firestore database.

        Parameters
        ----------
        portfolio: Portfolio
            A Portfolio object to be inserted into the Firestore database.

        Returns
        -------
        dict
            A dictionary representing the inserted portfolio document, including the generated document ID.
        """

        data = portfolio.to_dict()

        doc_ref = self._db.collection(self.portfolio_collection_name).document()
        doc_ref.set(data)
        data['id'] = doc_ref.id
        return data
    
    def update_user(self, user: User):
        """
        Updates an existing user document in the Firestore database.

        Parameters
        ----------
        user: User
            A User object containing updated data to be stored in the Firestore database.

        Returns
        -------
        dict
            A dictionary representing the updated user document, including the document ID.
        """

        data = user.to_dict()

        collection_ref = self._db.collection(self.user_collection_name)
        doc_ref = collection_ref.document(user.user_id)
        doc_ref.update(data)
        data['id'] = doc_ref.id
        return data
    
    def update_game(self, game_id: str, game: Game):
        """
        Updates an existing game document in the Firestore database.

        Parameters
        ----------
        game_id: str
            The ID of the game document to update.
        game: Game
            A Game object containing updated data to be stored in the Firestore database.

        Returns
        -------
        dict
            A dictionary representing the updated game document, including the document ID.
        """

        data = game.to_dict()

        collection_ref = self._db.collection(self.game_collection_name)
        doc_ref = collection_ref.document(game_id)
        doc_ref.update(data)
        data['id'] = doc_ref.id
        return data
    
    def update_portfolio(self, portfolio_id: str, portfolio: Portfolio):
        """
        Updates an existing portfolio document in the Firestore database.

        Parameters
        ----------
        portfolio_id: str
            The ID of the portfolio document to update.
        portfolio: Portfolio
            A Portfolio object containing updated data to be stored in the Firestore database.

        Returns
        -------
        dict
            A dictionary representing the updated portfolio document, including the document ID.
        """

        data = portfolio.to_dict()

        collection_ref = self._db.collection(self.portfolio_collection_name)
        doc_ref = collection_ref.document(portfolio_id)
        doc_ref.update(data)
        data['id'] = doc_ref.id
        return data
    
    def get_user(self, user_id: str):
        """
        Retrieves a user document from the Firestore database by user ID.

        Parameters
        ----------
        user_id: str
            The ID of the user document to retrieve.

        Returns
        -------
        dict
            A dictionary representing the retrieved user document, including the document ID.
            If the user document does not exist, an empty dictionary is returned.
        """

        doc_ref = self._db.collection(self.user_collection_name).document(user_id)
        user = doc_ref.get()
        if(user.exists):
            user_data = user.to_dict()
            user_data['id'] = doc_ref.id
            return user_data
        else:
            return {}
    
    def get_user_leaderboard(self):
        """
        Retrieves the top 10 users ordered by highscore in descending order.

        Parameters
        ----------
        None

        Returns
        -------
        list
            A list of dictionaries, each representing a user document with additional displayName.
        """

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
        """
        Retrieves a game document from the Firestore database by game ID.

        Parameters
        ----------
        game_id: str
            The ID of the game document to retrieve.

        Returns
        -------
        dict
            A dictionary representing the retrieved game document, including the document ID.
            If the game document does not exist, an empty dictionary is returned.
        """

        doc_ref = self._db.collection(self.game_collection_name).document(game_id)
        game = doc_ref.get()
        if(game.exists):
            game_data = game.to_dict()
            game_data['id'] = doc_ref.id
            return game_data
        else:
            return {}

    def get_user_active_game(self, user_id: str):
        """
        Retrieves the active game document for a specific user from the Firestore database.

        Parameters
        ----------
        user_id: str
            The ID of the user whose active game document is to be retrieved.

        Returns
        -------
        dict
            A dictionary representing the retrieved active game document, including the document ID.
            If no active game exists for the user, an empty dictionary is returned.
        """

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
        """
        Retrieves the portfolio document associated with a specific game from the Firestore database.

        Parameters
        ----------
        game_id: str
            The ID of the game whose portfolio document is to be retrieved.

        Returns
        -------
        dict
            A dictionary representing the retrieved portfolio document, including the document ID.
            If no portfolio exists for the game, an empty dictionary is returned.
        """

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