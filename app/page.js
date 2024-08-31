"use client";

import { useEffect, useState } from 'react';

export default function Home() {
    const [prices, setPrices] = useState({});
    const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
    //if you want to add FTSE use '^FTSE' to the list
    const stockSymbols = ['BATS.L', 'NG.L', 'GRG.L', 'SHEL.L', 'SVT.L','LLOY.L','UU.L','BP.L','SGE.L','BT-A.L']; // Stock symbols

    // Number of shares held for each stock
    const sharesHeld = {
        'BATS.L': 500,
        'NG.L': 1521,
        'GRG.L': 500,
        'SHEL.L': 534,
        'SVT.L': 425,
        'LLOY.L': 16493,
        'UU.L': 764,
        'BP.L': 1500,
        'SGE.L': 475,
        'BT-A.L': 2050,
    };



    useEffect(() => {
        async function fetchData() {
            const fetchedPrices = {};
            let portfolioValue = 0;

            for (const symbol of stockSymbols) {
                try {
                    const response = await fetch(`/api/stock?symbol=${symbol}`);
                    const data = await response.json();
                    
                    // Divide the price by 100 and keep two decimal places
                    const pricePerShare = data.price !== undefined 
                        ? (data.price / 100).toFixed(2) 
                        : 'Error';
                    
                    fetchedPrices[symbol] = pricePerShare;

                    // Calculate total value for this stock and round to nearest whole number
                    if (pricePerShare !== 'Error') {
                        const totalValue = Math.round(pricePerShare * sharesHeld[symbol]);
                        portfolioValue += totalValue;
                        fetchedPrices[symbol + '_total'] = totalValue.toLocaleString(); // Format with commas
                    }
                } catch (error) {
                    console.error(`Error fetching data for ${symbol}:`, error);
                    fetchedPrices[symbol] = 'Error';
                }
            }

            setPrices(fetchedPrices);
            setTotalPortfolioValue(Math.round(portfolioValue).toLocaleString()); // Set the total portfolio value, rounded to nearest whole number and formatted with commas
        }

        fetchData();
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 className='heading'>My FTSE Stock Portfolio</h1>
            {/* Display the total portfolio value */}
            <h2 className='sub-heading'style={{ marginTop: '20px' }}>Total Portfolio Value: £{totalPortfolioValue}</h2>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
                <thead className='table-heading'>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Symbol</th>
                        <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Price per share (£)</th>
                        <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Shares held</th>
                        <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Total value (£)</th>
                    </tr>
                </thead>
                <tbody className='table-body'>
                    {stockSymbols.map(symbol => {
                        const pricePerShare = prices[symbol];
                        const totalValue = prices[symbol + '_total'];

                        return (
                            <tr key={symbol}>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{symbol}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    {pricePerShare !== undefined ? `${pricePerShare}` : 'Loading...'}
                                </td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{sharesHeld[symbol]}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    {totalValue !== undefined ? `${totalValue}` : 'Loading...'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table> 
        </div>
    );
}