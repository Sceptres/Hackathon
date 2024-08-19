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
    componentDidMount() {
        this.fetch_stock_data()

    }
    componentDidUpdate(prevProps) {
        //if either props change then recompute
        if (prevProps.ticker !== this.props.ticker) {
          
                this.fetch_stock_data()
            
        }
        if (prevProps.date !== this.props.date) {
            if(this.props.date >prevProps.date ){
            this.fetch_stock_data()
            }else{
                alert("You can only go forward in Time")
            }
        }
    }
    fetch_stock_data = async () => {
        try {
            let startDate = this.props.date
            let newDate = this.props.defaultDate // setting to 2010 as start date

            if (!startDate) {
                startDate = new Date()
                const year = startDate.getFullYear();
                const month = String(startDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
                const day = String(startDate.getDate()).padStart(2, '0');

                startDate = `${year}-${month}-${day}`;
            } else {

                newDate = new Date(this.props.date);
                newDate.setMonth(newDate.getMonth() - 1);
                const year = newDate.getFullYear();
                const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
                const day = String(newDate.getDate()).padStart(2, '0');

                newDate = `${year}-${month}-${day}`;

            }
            console.log("New Stock Input")
            console.log({
                ticker: this.props.ticker,
                start_date: startDate,
                end_date: newDate

            })
            const response = await fetch('http://127.0.0.1:8001/external_api/get_stock_by_date', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticker: this.props.ticker,
                    start_date: newDate,
                    end_date: startDate

                }),
            });
            const data = await response.json();
            this.updateChartData(data);
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