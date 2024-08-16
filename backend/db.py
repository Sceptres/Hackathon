from firebase_admin import credentials, initialize_app, firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from enum import Enum
import datetime
import os

# Class that represents a portfolio document
class Portfolio:
    def __init__(
            self, 
            user_id: str, 
            balance: float, 
            net_profit: float, 
            total_profit: float, 
            total_loss: float, 
            total_trades: int
    ) -> None:
        self.user_id = user_id
        self.balance = balance
        self.net_profit = net_profit
        self.total_profit = total_profit
        self.total_loss = total_loss
        self.total_trades = total_trades

    @staticmethod
    def from_dict(dict: dict):
        user_id = dict['userId']
        balance = dict['balance']
        net_profit = dict['netProfit']
        total_profit = dict['totalProfit']
        total_loss = dict['totalLoss']
        total_trades = dict['totalTrades']
        return Portfolio(
            user_id = user_id,
            balance = balance,
            net_profit = net_profit,
            total_profit = total_profit,
            total_loss = total_loss,
            total_trades = total_trades
        )
    
    def to_dict(self):
        return {
            'userId': self.user_id,
            'balance': self.balance,
            'netProfit': self.net_profit,
            'totalProfit': self.total_profit,
            'totalLoss': self.total_loss,
            'totalTrades': self.total_trades
        }
    
# Class that represents the status of a transaction document
class TransactionStatus(Enum):
    OPEN = 'OPEN',
    CLOSED = 'CLOSED'

    @staticmethod
    def from_value(value):
        if value == 'OPEN':
            return TransactionStatus.OPEN
        elif value == 'CLOSED':
            return TransactionStatus.CLOSED
        else:
            raise Exception('Transaction status can only be OPEN or CLOSED') 

# Class that represents the transaction document
class Transaction:
    def __init__(
            self,
            user_id: str,
            portfolio_id: str,
            stock_symbol: str,
            quantity: int,
            price_at_buy_transaction: float,
            price_at_sell_transaction: float,
            transaction_open_date: datetime,
            transaction_close_date: datetime,
            status: TransactionStatus = TransactionStatus.OPEN
    ) -> None:
        self.user_id = user_id
        self.portfolio_id = portfolio_id
        self.stock_symbol = stock_symbol
        self.quantity = quantity
        self.price_at_buy_transaction = price_at_buy_transaction
        self.price_at_sell_transaction = price_at_sell_transaction
        self.transaction_open_date = transaction_open_date
        self.transaction_close_date = transaction_close_date
        self.status = status.name

    @staticmethod
    def from_dict(dict: dict):
        user_id = dict['userId']
        portfolio_id = dict['portfolioId']
        stock_symbol = dict['stockSymbol']
        quantity = dict['quantity']
        price_at_buy_transaction = dict['priceAtBuyTransaction']
        price_at_sell_transaction = dict['priceAtSellTransaction']
        transaction_open_date = dict['transactionOpenDate']
        transaction_close_date = dict['transactionCloseDate']
        status = TransactionStatus.from_value(dict['status'])
        return Transaction(
            user_id = user_id,
            portfolio_id = portfolio_id,
            stock_symbol = stock_symbol,
            quantity = quantity,
            price_at_buy_transaction = price_at_buy_transaction,
            price_at_sell_transaction = price_at_sell_transaction,
            transaction_open_date = transaction_open_date,
            transaction_close_date = transaction_close_date,
            status = status
        )

    def to_dict(self):
        return {
            'userId': self.user_id,
            'portfolioID': self.portfolio_id,
            'stockSymbol': self.stock_symbol,
            'quantity': self.quantity,
            'priceAtBuyTransaction': self.price_at_buy_transaction,
            'priceAtSellTransaction': self.price_at_sell_transaction,
            'transactionOpenDate': self.transaction_open_date,
            'transactionCloseDate': self.transaction_close_date,
            'status': self.status
        }
    
# Class to connect to and communicate with Firestore db
class DBConnection:
    def __init__(self) -> None:
        self._cred = credentials.Certificate(f"{os.getcwd()}/backend/key.json")
        initialize_app(self._cred)
        self._db = firestore.client()
        self.transaction_collection_name = 'transaction'
        self.portfolio_collection_name = 'portfolio'

    def insert_portfolio(self, portfolio: Portfolio):
        data = portfolio.to_dict()

        doc_ref = self._db.collection(self.portfolio_collection_name).document()
        doc_ref.set(data)
        data['id'] = doc_ref.id
        return data
    
    def insert_transaction(self, transaction: Transaction):
        data = transaction.to_dict()

        doc_ref = self._db.collection(self.transaction_collection_name).document()
        doc_ref.set(data)
        data['id'] = doc_ref.id
        return data
    
    def update_portfolio(self, portfolio_id: str, portfolio: Portfolio):
        data = portfolio.to_dict()

        collection_ref = self._db.collection(self.portfolio_collection_name)
        doc_ref = collection_ref.document(portfolio_id)
        doc_ref.update(data)
        data['id'] = doc_ref.id
        return data

    def update_transaction(self, transaction_id: str, transaction: Transaction):
        data = transaction.to_dict()
        
        collection_ref = self._db.collection(self.transaction_collection_name)
        doc_ref = collection_ref.document(transaction_id)
        doc_ref.update(data)
        data['id'] = doc_ref.id
        return data
    
    def get_user_portfolio(self, user_id: str):
        doc_ref = self._db.collection(self.portfolio_collection_name)
        query = doc_ref.where(filter = FieldFilter('userId', '==', user_id))
        portfilio = query.get()[0]
        return portfilio.to_dict()
    
    def get_user_transactions(self, user_id: str):
        doc_ref = self._db.collection(self.transaction_collection_name)
        query = doc_ref.where(filter = FieldFilter('userId', '==', user_id))
        transactions_stream = query.stream()
        return [doc.to_dict() for doc in transactions_stream]
    
    def get_portfolio_transactions(self, portfolio_id: str):
        doc_ref = self._db.collection(self.transaction_collection_name)
        query = doc_ref.where(filter = FieldFilter('portfolioId', '==', portfolio_id))
        transactions_stream = query.stream()
        return [doc.to_dict() for doc in transactions_stream]