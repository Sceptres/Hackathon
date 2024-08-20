import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { getDate, dateToStringFormat } from '../../help/help'

// Register the necessary chart components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

class StockUI extends Component {
    state = {}


    constructor(props) {
        super(props);
        this.state = {
            processedResults: [],

            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Stock Price',
                        data: [],
                        borderColor: 'black',
                        backgroundColor: 'black',
                        fill: true,
                        tension: 0.4,  // Curve line
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Stock Price',
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        };
    }
    componentDidUpdate(prevProps) {
        //if either props change then recompute
        if (prevProps.ticker !== this.props.ticker) {
                this.fetch_stock_data()
        }
        
        if (prevProps.currentDate && prevProps.currentDate !== this.props.currentDate) {
            this.fetch_stock_data()
        }
    }
    fetch_stock_data = async () => {
        try {
            // Represents the current date chosen by the user
            let currentDate = this.props.currentDate;
            let nowDate = dateToStringFormat(getDate(currentDate));
            
            // Represents the date in the past to which we are showing data
            let oldDate = getDate(currentDate);
            oldDate.setMonth(oldDate.getMonth() - 1);
            oldDate = dateToStringFormat(oldDate);

            console.log("New Stock Input")
            console.log({
                ticker: this.props.ticker,
                start_date: oldDate,
                end_date: nowDate
            })
            const response = await fetch('http://127.0.0.1:8001/external_api/get_stock_by_date', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticker: this.props.ticker,
                    start_date: oldDate,
                    end_date: nowDate
                }),
            });
            const data = await response.json();
            if(data.length === 0) {
                alert('No data for this stock at this time. Please choose another stock.')
            } else {
                this.props.stockPriceUpdater(data[data.length-1].price); // Update the current stock price
                this.updateChartData(data);   
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    updateChartData = (newData) => {
        this.setState({
            data: {
                labels: newData.map(item => item.Date),
                datasets: [
                    {
                        label: 'Average Stock Price per Day',
                        data: newData.map(item => item.price),
                        borderColor: 'black',
                        backgroundColor: 'black',
                        fill: true,
                        tension: 0.4,
                    },
                ],
            },
        });
    };
    render() {
        return <Line data={this.state.data} options={this.state.options} />;
    }
}

export default StockUI;