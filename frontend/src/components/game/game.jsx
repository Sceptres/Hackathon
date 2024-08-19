import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/authContext'
import { useNavigate, Navigate } from 'react-router-dom'
import { getDate, dateToStringFormat, formatNumberToUSD, getGamePortfilio } from '../../help'
import StockUI from './stockUI'

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
    const navigate = useNavigate()
    const gameId = 'yRHqAIZsbiHvqu9ONC1t';

    const [searchTerm, setSearchTerm] = useState();
    const [selectedOption, setSelectedOption] = useState('');

    const defaultDate = "2005-10-10"
    const [seletedDate, setSeletedDate] = useState(defaultDate);

    const [currentStockPrice, setCurrentStockPrice] = useState();


    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

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

        if(chosenDate < currentDate) {
            alert("You can only go forward in time")
        } else if(chosenDate.getDay() == 6) { // Is the day of the week a Saturday?
            chosenDate.setDate(chosenDate.getDate() - 1);
            setSeletedDate(dateToStringFormat(chosenDate))
        } else if(chosenDate.getDay() == 0) { // Is the day of the week a Sunday?
            chosenDate.setDate(chosenDate.getDate() + 1);
            setSeletedDate(dateToStringFormat(chosenDate))
        } else {
            setSeletedDate(e.target.value)
        }
    }


    const handleOptionClick = (option) => {
        setShowDropdown(false);
        setSelectedOption(option)
    };

    const [portfolio, setPortfolio] = useState(null);

    useEffect(() => {
        const gamePortfolio = getGamePortfilio(gameId);
        gamePortfolio.then(data => setPortfolio(data));
    }, []);

    const [isBuyPopupOpen, setIsBuyPopupOpen] = useState(false);
    const [isSellPopupOpen, setIsSellPopupOpen] = useState(false);

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
        const updatedPortfolio = buyStock(selectedOption, quantity, seletedDate, gameId);
        updatedPortfolio.then((data) => setPortfolio(data));
        toggleBuyPopup();
    };

    const onSellPopupClosed = (quantity) => {
        const updatedPortfolio = sellStock(selectedOption, quantity, seletedDate, gameId);
        updatedPortfolio.then((data) => setPortfolio(data));
        toggleSellPopup();
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100">
            <div className='text-2xl font-bold pt-14'>
                <button onClick={() => { navigate('/home') }}
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

            <div className="bg-white w-full h-full">

                <ul className="overflow-y-scroll scrollbar-hide w-full mt-8">

                    <form className="flex items-center max-w-sm mx-auto">
                        
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
                                            onClick={() => handleOptionClick(option['symbol'])} // assuming option has a 'name' field
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

                    <StockUI ticker={selectedOption} currentDate={seletedDate} stockPriceUpdater={setCurrentStockPrice}></StockUI>

                    <div className="flex justify-center space-x-4 mt-4">
                        <button
                            onClick={onSellClick}
                            className="w-1/3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Sell
                        </button>
                        {isSellPopupOpen && <Popup title={selectedOption} stockPrice={currentStockPrice} maxValue={portfolio.stocks[selectedOption]} startValue={0} buttonName={'Sell'} buttonClass={'bg-red-500 text-white rounded-lg hover:bg-red-600'} onClose={onSellPopupClosed} toggleMethod={toggleSellPopup} />}
                        <button
                            onClick={onBuyClick}
                            className="w-1/3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            Buy
                        </button>
                        {isBuyPopupOpen && <Popup title={selectedOption} stockPrice={currentStockPrice} maxValue={Math.floor(portfolio && currentStockPrice && portfolio.balance/currentStockPrice)} startValue={0} buttonName={'Buy'} buttonClass={'bg-green-500 text-white rounded-lg hover:bg-green-600'} onClose={onBuyPopupClosed} toggleMethod={toggleBuyPopup} />}
                    </div>
                </ul>

            </div>
        </div>
    )
}

export default Game