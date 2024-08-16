import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './../configuration';

/**
 * 
 * @param {object} portfolio The portfolio object to upsert to the database
 */
export async function insertPortfolio(portfolio) {
    const portfolioCollection = collection(db, 'portfolio');
    await setDoc(doc(portfolioCollection), portfolio);
}

/**
 * 
 * @param {object} transaction The transaction object to upsert to the database
 */
export async function insertTransaction(transaction) {
    const transactionCollection = collection(db, 'transaction');
    await setDoc(doc(transactionCollection), transaction);
}

/**
 * 
 * @param {string} portfolioId The id of the portfolio document to update
 * @param {object} portfolio The new data to update the document with
 */
export async function updatePortfolio(portfolioId, portfolio) {
    await setDoc(doc(db, 'portfolio', portfolioId), portfolio);
}

/**
 * 
 * @param {string} transactionId The id of the transaction document to update
 * @param {object} transaction The new data to update the document with
 */
export async function updateTransaction(transactionId, transaction) {
    await setDoc(doc(db, 'transaction', transactionId), transaction);
}

/**
 * 
 * @param {string} userId The id of the user to get the portfolio of
 * @returns The portfolio document of the given user
 */
export async function getUserPortfolio(userId) {
    const portfolioCollection = collection(db, 'portfolio');
    const q = query(portfolioCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if(!querySnapshot.empty()) {
        return querySnapshot.docs[0];
    } else {
        throw `No portfolio found for this user!`;
    }
}

/**
 * 
 * @param {string} userId The id of the user to get the transactions of
 * @returns A list of transactions belonging to the given user
 */
export async function getUserTransactions(userId) {
    const transactionCollection = collection(db, 'transaction');
    const q = query(transactionCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs;
}

/**
 * 
 * @param {string} portfolioId The id of the portfolio to get the transactions of 
 * @returns A list of transactions belonging to the given portfolio
 */
export async function getPortfolioTransactions(portfolioId) {
    const transactionCollection = collection(db, 'transaction');
    const q = query(transactionCollection, where('portfolioId', '==', portfolioId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs;
}