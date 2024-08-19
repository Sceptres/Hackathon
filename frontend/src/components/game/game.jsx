import React, { useEffect, useState } from 'react'
import { useNavigate, Navigate, useLocation } from 'react-router-dom'
import { getDate, dateToStringFormat, formatNumberToUSD, getGamePortfilio, getUserActiveGame, updateGame } from '../../help/help'
import StockUI from './stockUI'
import { auth } from '../../firebase/firebase'

/**
 * 
 * @param {object} props The props of this component 
 * @returns A popup view for the buy/sell buttons
 */
const Popup = (props) => {
    const [sliderValue, setSliderValue] = useState(0);

    const formatStockCount = (count) => {
        const str = formatNumberToUSD(count);
        return str.substring(1);
    }
  
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative pt-12">
                    <h2 className="text-xl font-semibold mb-4 text-center">{props.title}</h2>

                    <input
                        type="range"
                        min={0}
                        max={props.maxValue}
                        value={sliderValue || props.startValue}
                        onChange={(e) => setSliderValue(e.target.value)}
                        className="w-full"
                    />

                    <p className="mt-2 text-center">Stock Count: {formatStockCount(sliderValue)}</p>
                    <p className="mt-2 text-center">Value: {formatNumberToUSD(sliderValue*props.stockPrice)}</p>

                    <button
                        onClick={() => props.onClose(sliderValue)}
                        className={`mt-4 w-full py-2 ${props.buttonClass}`}
                    >
                        {props.buttonName}
                    </button>
                    <button
                        onClick={props.toggleMethod}
                        className="mt-2 w-full py-2 bg-gray-200 text-gray-700 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
  };

/**
 * 
 * @param {string} ticker The ticker of the stock being bought
 * @param {number} quantity The amount of the given stock to be bought
 * @param {string} date The date on which the stock is being bought
 * @param {string} gameId The id of the game where the buy transaction is happening
 * @returns The updated portfolio of the given game after the buy transaction
 */
async function buyStock(ticker, quantity, date, gameId) {
    const response = await fetch('http://127.0.0.1:8001/transaction/buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ticker: ticker,
            quantity: quantity,
            date: date,
            gameId: gameId
        })
    });
    const updatedPortfolio = await response.json();
    return updatedPortfolio;
}

/**
 * 
 * @param {string} ticker The ticker of the stock being sold
 * @param {number} quantity The amount of the given stock to be sold
 * @param {string} date The date on which the stock is being sold
 * @param {string} gameId The id of the game where the sell transaction is happening
 * @returns The updated portfolio of the given game after the sell transaction
 */
async function sellStock(ticker, quantity, date, gameId) {
    const response = await fetch('http://127.0.0.1:8001/transaction/sell', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ticker: ticker,
            quantity: quantity,
            date: date,
            gameId: gameId
        })
    });
    const updatedPortfolio = await response.json();
    return updatedPortfolio;
}

const Game = () => {
    const navigate = useNavigate();
    const currentUser = auth.currentUser;

    const [game, setGame] = useState(null);
    const [portfolio, setPortfolio] = useState(null);

    const [isBuyPopupOpen, setIsBuyPopupOpen] = useState(false);
    const [isSellPopupOpen, setIsSellPopupOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState();
    const [selectedOption, setSelectedOption] = useState('');

    const [seletedDate, setSeletedDate] = useState(null);

    const [currentStockPrice, setCurrentStockPrice] = useState();


    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const gameObj = getUserActiveGame(currentUser.uid);
        gameObj.then((data) => {
            setGame(data);
            setSeletedDate(data.currentDate);
            const gamePortfolio = getGamePortfilio(data.id);
            gamePortfolio.then((portfolioData) => setPortfolio(portfolioData));
        });
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setSearchTerm(value);
    };

    const onSearchApi = async (e) => {
        e.preventDefault();

        const value = searchTerm

        if (value) {
            const response = await fetch('http://127.0.0.1:8001/external_api/get_stock_ticker', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    keyword: value

                }),
            })
            const data = await response.json();
            setFilteredOptions(data);
            setShowDropdown(true);
        }
    }

    const handleDateChange = (e) => {
        const chosenDate = getDate(e.target.value);
        const currentDate = getDate(seletedDate);

        const updateGameOnDateChange = (newCurrentDate) => {
            const gamePromise = updateGame(game.id, currentUser.uid, newCurrentDate, 0, "ACTIVE");
            gamePromise.then((newGame) => setGame(newGame));
        }

        if(!selectedOption) {
            alert("Please select a stock through the search bar first!");
            return;
        }

        if(chosenDate < currentDate) {
            alert("You can only go forward in time")
        } else if(chosenDate.getDay() == 6) { // Is the day of the week a Saturday?
            chosenDate.setDate(chosenDate.getDate() - 1);
            const newDateStr = dateToStringFormat(chosenDate);
            setSeletedDate(newDateStr);
            updateGameOnDateChange(newDateStr);
        } else if(chosenDate.getDay() == 0) { // Is the day of the week a Sunday?
            chosenDate.setDate(chosenDate.getDate() + 1);
            const newDateStr = dateToStringFormat(chosenDate);
            setSeletedDate(newDateStr);
            updateGameOnDateChange(newDateStr);
        } else {
            setSeletedDate(e.target.value);
            updateGameOnDateChange(e.target.value);
        }
    }


    const handleOptionClick = (option) => {
        setShowDropdown(false);
        setSelectedOption(option)
    };

    const toggleBuyPopup = () => {
        setIsBuyPopupOpen(!isBuyPopupOpen);
    };

    const toggleSellPopup = () => {
        setIsSellPopupOpen(!isSellPopupOpen);
    };

    const onBuyClick = () => {
        if(selectedOption) {
            toggleBuyPopup();
        } else {
            alert('No stock chosen to buy!');
        }
    };

    const onSellClick = () => {
        if(selectedOption && portfolio.stocks[selectedOption] > 0) {
            toggleSellPopup();
        } else if(!selectedOption) {
            alert('No stock chosen to sell!');
        } else if(!portfolio.stocks[selectedOption] || (portfolio.stocks && portfolio.stocks[selectedOption] > 0)) {
            alert('Cannot sell a stock that you do not own!');
        }
    };

    const onBuyPopupClosed = (quantity) => {
        const updatedPortfolio = buyStock(selectedOption, quantity, seletedDate, game.id);
        updatedPortfolio.then((data) => setPortfolio(data));
        toggleBuyPopup();
    };

    const onSellPopupClosed = (quantity) => {
        const updatedPortfolio = sellStock(selectedOption, quantity, seletedDate, game.id);
        updatedPortfolio.then((data) => setPortfolio(data));
        toggleSellPopup();
    };

    if(!currentUser) {
        return <Navigate to={'/login'} replace={true} />;
    } else {
        return (
            <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen">
                <div className="text-2xl font-bold pt-14">
                    <button onClick={() => { navigate('/endgame') }}
                        className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 inline-block">
                        End Game
                    </button>
                    <button onClick={() => { navigate('/guide') }}
                        className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 inline-block">
                        Read the Investment Guide!
                    </button>
                </div>
    
                <div className="text-xl font-semibold mt-4">
                    Balance: {portfolio && portfolio.balance && formatNumberToUSD(portfolio.balance)}
                </div>
    
                <div className="bg-white w-full flex-grow flex flex-col items-center">
                    <form className="flex items-center max-w-sm mx-auto mt-8">
                        <input type="date" id="stock" name="stock" value={seletedDate} onChange={handleDateChange} className="mr-5"></input>
    
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                id="simple-search"
                                value={searchTerm}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search Stock name..."
                                required
                            />
                            {showDropdown && filteredOptions.length > 0 && (
                                <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600">
                                    {filteredOptions.map((option, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleOptionClick(option['symbol'])}
                                            className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 dark:text-white"
                                        >
                                            {option['symbol']}:{option['name']}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button onClick={onSearchApi} className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                            <span className="sr-only">Search</span>
                        </button>
                    </form>
    
                    <div className="flex-grow w-full max-w-6xl mt-4 flex items-center justify-center" style={{ maxHeight: 'calc(100vh - 20rem)' }}>
                        <div className="w-full">
                            <StockUI ticker={selectedOption} currentDate={seletedDate} stockPriceUpdater={setCurrentStockPrice} />
                        </div>
                    </div>
    
                    <div className="flex justify-center space-x-4 mt-4 w-full max-w-4xl">
                        <button
                            onClick={onSellClick}
                            className="w-1/3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            style={{ maxWidth: '150px' }} // Adjust this value as needed
                        >
                            Sell
                        </button>
                        {isSellPopupOpen && <Popup title={selectedOption} stockPrice={currentStockPrice} maxValue={portfolio.stocks[selectedOption]} startValue={0} buttonName={'Sell'} buttonClass={'bg-red-500 text-white rounded-lg hover:bg-red-600'} onClose={onSellPopupClosed} toggleMethod={toggleSellPopup} />}
                        <button
                            onClick={onBuyClick}
                            className="w-1/3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            style={{ maxWidth: '150px' }} // Adjust this value as needed
                        >
                            Buy
                        </button>
                        {isBuyPopupOpen && <Popup title={selectedOption} stockPrice={currentStockPrice} maxValue={Math.floor(portfolio && currentStockPrice && portfolio.balance/currentStockPrice)} startValue={0} buttonName={'Buy'} buttonClass={'bg-green-500 text-white rounded-lg hover:bg-green-600'} onClose={onBuyPopupClosed} toggleMethod={toggleBuyPopup} />}
                    </div>
                </div>
            </div>
        );
    }
}

export default Game