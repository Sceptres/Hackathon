import React, { useState } from 'react'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import StockUI from './stockUI'


const Game = () => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [seletedDate, setSeletedDate] = useState('');


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

        setSeletedDate(e.target.value)
    }


    const handleOptionClick = (option) => {
        setShowDropdown(false);
        setSelectedOption(option)
    };
    return (

        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
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
            <div className="bg-white w-full h-full">

                <ul className="overflow-y-scroll scrollbar-hide w-full mt-8">

                    <form className="flex items-center max-w-sm mx-auto">
                        <input type="date" id="stock" name="stock" onChange={handleDateChange} class="mr-5"></input>

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

                    <StockUI ticker={selectedOption} date={seletedDate}></StockUI>

                </ul>

            </div>
        </div>


    )
}

export default Game